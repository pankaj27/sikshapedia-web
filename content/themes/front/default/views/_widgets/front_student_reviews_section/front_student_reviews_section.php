<?php
if(!empty($review_data)){
	$i=1;
	foreach ($review_data as $key => $value) {
		?>
		<div class="row card" style="margin-left:5px !important;margin-right:5px !important;">
			<div class="card-title list-title d-flex justify-content-between mb-1">
				<div class="d-flex" style="padding:15px !important;font-size:17px !important;">
					<p class="font-weight-semi num mr-1"><?php echo $i;?>.</p>
					<p class="mb-3 font-weight-semi"><?php echo $value['college_name'];?> <?php echo ($value['course_name'])?'['.$value['course_name'].']':'';?></p>
				</div>

				<div class="col text-right" style="padding:15px !important;">
					<?php
					if($value['review_status']=='approved'){
						?>
						<p class="mb-3 font-weight-semi text-success" style="padding:5px;float:right !important;background-color: #3fdc354a;">Approved</p>
						<?php
					}else if($value['review_status']=='not_approved'){
						?>
						<p class="mb-3 font-weight-semi text-danger" style="padding:5px;float:right !important;background-color: #dc354530;">Not Approved</p>
						<?php
					}else if($value['review_status']=='incomplete'){
						?>
						<p class="mb-3 font-weight-semi text-danger" style="padding:5px;float:right !important;background-color: #dc354530;">Inccomplete</p>
						<?php
					}
					else if($value['review_status']=='incomplete_and_not_approved'){
						?>
						<p class="mb-3 font-weight-semi text-danger" style="padding:5px;float:right !important;background-color: #dc354530;">Incomplete and Not Approved</p>
						<?php
					}else if($value['review_status']=='complete_and_not_approved'){
						?>
						<p class="mb-3 font-weight-semi text-danger" style="padding:5px;float:right !important;background-color: #dc354530;">Complete and Not Approved</p>
						<?php
					}else if($value['review_status']=='complete_and_not_moderated'){
						?>
						<p class="mb-3 font-weight-semi text-danger" style="padding:5px;float:right !important;background-color: #dc354530;">Complete and Not Approved</p>
						<?php
					}else if($value['review_status']=='rejected'){
						?>
						<p class="mb-3 font-weight-semi text-danger" style="padding:5px;float:right !important;background-color: #dc354530;">Rejected</p>
						<?php
					}

					?>
					
				</div>
			</div>
			<div class="card-body col-lg-12 hh-grayBox pb20">
				<div class="row justify-content-between">
					<div class="order-tracking completed">
						<span class="is-complete"></span>
						<p>Submitted On<br><span><?php echo $value['review_at'];?></span></p>
					</div>
					<div class="order-tracking">
						<span class="is-complete">
							<?php echo ($value['review_marksheet']=='yes')?'<i class="fa fa-check" style="padding-top:8px !important;"></i>':'<i class="fa fa-times fa-lg" style="padding-top:8px !important;"></i>';?>
						</span>
						<p><?php echo ($value['review_marksheet']=='yes')?'Done':'Pending';?><br><span>Upload Photo</span></p>
					</div>
					<div class="order-tracking">
						<span class="is-complete">
							<?php echo ($value['review_id_proof']=='yes')?'<i class="fa fa-check" style="padding-top:8px !important;"></i>':'<i class="fa fa-times fa-lg" style="padding-top:8px !important;"></i>';?>
						</span>
						<p><?php echo ($value['review_id_proof']=='yes')?'Done':'Pending';?><br><span>Upload ID Card</span></p>
					</div>
					<div class="order-tracking <?php echo ($value['review_moderation']=='done')?'completed':'';?>">
						<span class="is-complete"></span>
						<p><?php echo ucwords($value['review_moderation']);?><br><span>Moderation</span></p>
					</div>
					<div class="order-tracking <?php echo ($value['review_status']=='approved')?'completed':'';?>">
						<span class="is-complete"><i class="fa fa-times fa-lg" style="padding-top:8px !important;"></i></span>
						<p>Status<br><span><?php echo ucwords(str_replace('_',' ', $value['review_status']));?></span></p>
					</div>
					
				</div>
			</div>
			<?php
			if($value['review_edit']!=''){
				?>
				<div class="card-footer">
					<div class="row">
						<div class="col-lg-3">
							<a href="<?php echo $value['review_edit'];?>" class="btn btn-sm btn-warning">Edit</a>
						</div>
					</div>
				</div>
				<?php
			}
			?>
				
		</div>
		<?php

		$i++;
	}
}
?>

<style type="text/css">
	.hh-grayBox {
		background-color: #FFF;
		margin-bottom: 0px;
		padding: 5px;
	  	margin-top: 0px;
	}
	.pt45{padding-top:45px;}
	.order-tracking{
		text-align: center;
		width: 20%;
		position: relative;
		display: block;
	}



	.order-tracking .is-complete{
		display: block;
		position: relative;
		border-radius: 50%;
		height: 30px;
		width: 30px;
		border: 0px solid #AFAFAF;
		background-color: #f7be16;
		margin: 0 auto;
		transition: background 0.25s linear;
		-webkit-transition: background 0.25s linear;
		z-index: 2;
	}
	.order-tracking .is-complete:after {
		display: block;
		position: absolute;
		content: '';
		height: 14px;
		width: 7px;
		top: -2px;
		bottom: 0;
		left: 5px;
		margin: auto 0;
		border: 0px solid #AFAFAF;
		border-width: 0px 2px 2px 0;
		transform: rotate(45deg);
		opacity: 0;
	}
	.order-tracking.completed .is-complete{
		border-color: #27aa80;
		border-width: 0px;
		background-color: #27aa80;
	}
	.order-tracking.completed .is-complete:after {
		border-color: #fff;
		border-width: 0px 3px 3px 0;
		width: 7px;
		left: 11px;
		opacity: 1;
	}




	.order-tracking p {
		color: #A4A4A4;
		font-size: 16px;
		margin-top: 8px;
		margin-bottom: 0;
		line-height: 20px;
	}
	.order-tracking p span{font-size: 14px;}
	.order-tracking.completed p{color: #000;}
	.order-tracking::before {
		content: '';
		display: block;
		height: 3px;
		width: calc(100% - 4px);
		background-color: #f7be16;
		top: 13px;
		position: absolute;
		left: calc(-50% + 2px);
		z-index: 0;
	}
	.order-tracking:first-child:before{display: none;}
	.order-tracking.completed:before{background-color: #27aa80;}


	span.is-complete i{		
		color: #fff;
	}

</style>