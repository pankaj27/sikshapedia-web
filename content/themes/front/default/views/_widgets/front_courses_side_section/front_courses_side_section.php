<?php defined('BASEPATH') OR exit('No direct script access allowed');?>



<?php
if(!empty($course_data)){
	?>
	<div class="card notificationCard mb-4">
		<div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  <h5 class="m-0">Learn more about the courses</h5>
		</div>
		<ul class="list-group list-group-flush">
			<?php
			foreach ($course_data as $key => $value) {
				?>
				<li class="list-group-item">
			      <div class="media-body">

			      	<?php
			      	if(!empty($value['course_url'])){
			      		?>
			      		<a href="<?php echo $value['course_url'];?>"><h6 class="mb-0 color2"><?php echo $value['course_name'];?></h6></a>
			      		<?php
			      	}else{
			      		?>
			      		<h6 class="mb-0 color2"><?php echo $value['course_name'];?></h6>
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