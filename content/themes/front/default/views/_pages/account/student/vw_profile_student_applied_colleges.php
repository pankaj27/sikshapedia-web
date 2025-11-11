<?php

if(!empty($colleges)){
	foreach ($colleges as $key => $value) {
		?>
		<div class="col-12 applied-colleges">
		  <div class="applied-col-wrap p-3">
		    <a href="<?php echo $value['college_url'];?>" class="text-decoration-none d-flex">
		      <img data-src="<?php echo $value['college_logo'];?>?h=60&amp;w=60&amp;mode=stretch" src="<?php echo $value['college_logo'];?>?h=60&amp;w=60&amp;mode=stretch" alt=" logo" height="60px" class="applied-col-img mr-4 lazyloaded">
		      <div class="jsx-2757529700 applied-col-detail flex-fill">
		        <div class="jsx-2757529700">
		          <p class="heading"><?php echo $value['college_name'];?></p>
		          <span class="subheading"><?php echo $value['college_country_state_city'];?></span>
		        </div>
		        <div class="applied-date">
		          <span class="heading"><?php echo $value['application_date'];?></span>
		          <span class="subheading">Applied Date</span>
		        </div>
		      </div>
		    </a>
		  </div>
		</div>
		<?php
	}
}


?>

