<?php defined('BASEPATH') OR exit('No direct script access allowed');?>



<?php
if(!empty($faculties_data)){
	?>
	<div class="card notificationCard mb-4">
		<div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  <h5 class="m-0">Faculties</h5>
		</div>
		<ul class="list-group list-group-flush">
			<?php
			foreach ($faculties_data as $key => $value) {
				?>
				<li class="list-group-item">
			      <div class="media-body">
			        <h6 class="mb-0 color2"><a href="<?php echo $faculty_page_link;?>"><?php echo $value['faculty_name'];?></a></h6>
			        <small> <?php echo $value['faculty_designation_departments'];?></small> 
			      </div>
				</li>
				<?php
			}
			?>
		</ul>
		<div class="card-header bg-white text-center">
		  <a href="<?php echo $faculty_page_link;?>">View All Faculties (<?php echo $total_faculty_count;?>)</a>
		</div>
	</div>
	<?php
}
?>