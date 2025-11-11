<?php

if(!empty($courses_data)){
	?>
		<div class="card notificationCard mb-4">
      <div class="card-header bg-orange-gradient border-none d-flex justify-content-between align-items-center">
		  	<h5 class="m-0">TOP COURSES</h5>
			</div>
      <ul class="list-group list-group-flush" id="college_courses_list">
       <?php
       foreach ($courses_data as $key => $value) {
       	?>
       	<li class="list-group-item">
            <a href="<?php echo $value['access_link'];?>" class="media"> 
              <div class="media-body">
                <h6 class="mb-0 color2"><a href="<?php echo $value['access_link'];?>"><?php echo $value['course_name'];?></a></h6>
                <small> <?php echo $value['duration'];?> </small> 
              </div>
            </a>
          </li>
       	<?php
       }
       ?>

      </ul>
      <div class="card-footer bg-white text-center color2" style="background-color:#ccc;">
        <a href="<?php echo $all_access_link;?>">VIEW MORE COURSES</a>
      </div>
    </div>
	<?php
}

?>