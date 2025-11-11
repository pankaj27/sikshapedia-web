<?php defined('BASEPATH') OR exit('No direct script access allowed');?>



<?php
if(!empty($exam_data)){

	?>
	<div class="card notificationCard mb-4">
		<div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  <h5 class="m-0">Learn more about the exams accepted</h5>
		</div>
		<ul class="list-group list-group-flush">
			<?php
			foreach ($exam_data as $key => $value) {
				?>
				<li class="list-group-item">
			      <div class="media-body">

			      	<?php
			      	if(!empty($value['exam_url'])){
			      		?>
			      		<a href="<?php echo $value['exam_url'];?>"><h6 class="mb-0 color2"><?php echo $value['exam_full_name'];?> [ <?php echo $value['exam_name'];?> ]</h6></a>
			      		<small> <?php echo $value['exam_course'];?></small> 
			      		<?php
			      	}else{
			      		?>
			      		<h6 class="mb-0 color2"><?php echo $value['exam_full_name'];?> [ <?php echo $value['exam_name'];?> ]</h6>
			      		<small> <?php echo $value['exam_course'];?></small> 
			      		<?php
			      	}

			      	?>

			         
			      </div>
				</li>
				<?php
			}
			?>
		</ul>
	</div>
	<?php
}
?>