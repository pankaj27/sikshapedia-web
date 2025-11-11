<?php
if(!empty($upcomming_exams)){
	?>
	<div class="jsx-626553351  card my-4 bg-white">
	   <div class="jsx-626553351  
	      default-header default_bg_color d-flex  align-items-center pl-4 
	      ">Upcoming exams</div>
	   <div class="jsx-626553351  default_body">
	      <ul class="jsx-3951915900 list-unstyled mb-0">
	      	<?php
	      	foreach ($upcomming_exams as $key => $value) {
	      		?>
	      		<li class="jsx-3951915900 py-2 sidebar-single-elem border-bottom px-3">
		            <a class="jsx-3951915900 media text-decoration-none " href="<?php echo $value['exam_url'];?>">
		               <div class="jsx-3951915900 media-body font-weight-semi ">
		                  <p class="jsx-3951915900 mb-0 common_title"><?php echo $value['exam_formatted_name'];?></p>
		                  <span class="jsx-3951915900 text-success-light text-md pl-3"><?php echo $value['exam_date'];?></span>
		               </div>
		            </a>
		         </li>
	      		<?php
	      	}
	      	?>
	      </ul>
	   </div>
	</div>
	<?php
}

?>