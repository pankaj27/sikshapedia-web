<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="headerBnrSec">
    <img src="<?php echo $user_banner;?>" class="headerBnrImg">
    <div class="wrapper">
	    <div class="headerBnrPanel">
	        <div class="bnrThumbBox">
	          <div class="bnrThumb shadow bg-white"><img src="<?php echo $user_logo;?>"></div>
	          <div class="bnrThumbCon">
	            <h5 class="m-0"><?php echo isset($userdata)?$userdata->user_fullname:'';?> <?php echo ($userdata->is_verified_by_admin=='2')?'(Account not verfied yet by System Admin)':'';?></h5>
	            <?php
	            if($userdata->user_role==0){
	            	?>
					<p class="m-0 d-none d-lg-block"><i class="fas fa-envelope"></i> <?php echo isset($userdata)?$userdata->user_email:'';?></p>
	            	<?php
	            }
	            ?>
	            
	          </div>
	        </div>
	        <!-- <div class="headerBnrCon">
	          <button type="button" class="btn btn-success btn-sm"><i class="fas fa-star"></i> Applied  <span class="badge">24</span></button>
	          <button type="button" class="btn btn-warning btn-sm"><i class="far fa-clock"></i> Application  <span class="badge">24</span></button>
	        </div> -->
	        <div class="isa-tab-filter">
	            <ul class="text-right">
	                <li class="placeholder"> <a class="">Go to</a></li>
	                <?php
	                if(in_array($userdata->user_role, array(0,3,4))){
	                	?>
	                	<li class="filter"><a <?php echo is_method('index')?'class="selected"':'';?> href="<?php echo base_url();?>account">General</a></li>
	                	<?php
	                }
	                ?>
	                

	                <?php
					if(in_array($userdata->user_role, array(3,4))){
	                	?>
	                	<!-- <li class="filter info_tabs" data-tabs="page_settings"><a data-type="Page">Page</a></li> -->
		                <li class="filter"><a <?php echo is_method('indexAccountInfoSettings')?'class="selected"':'';?> href="<?php echo base_url();?>account/info">Info</a></li>
		                <!-- <li class="filter"><a data-type="Ranking">Ranking</a></li> -->
		                <li class="filter"><a <?php echo (is_method('indexAccountCoursesFeesSettings') || is_method('indexAccountCoursesFeesSettingsAdd') || is_method('indexAccountCoursesFeesSettingsEdit'))?'class="selected"':'';?> href="<?php echo base_url();?>account/course">Courses & Fees</a></li>
		                <!-- <li class="filter info_tabs" data-tabs="admission_settings"><a >Admission <?php echo date('Y');?></a></li>
		                <li class="filter"><a data-type="Placement">Placement</a></li> -->
		                <li class="filter"><a <?php echo (is_method('indexAccountGallerySettings') || is_method('indexAccountGallerySettingsAdd') || is_method('indexAccountGallerySettingsEdit'))?'class="selected"':'';?> href="<?php echo base_url();?>account/gallery">Gallery</a></li>
		                <!-- <li class="filter"><a data-type="Result">Result</a></li> -->
		            <?php
	                }

	                if(in_array($userdata->user_role, array(3))){

	                ?>
		                <li class="filter"><a <?php echo (is_method('indexAccountCollegeSettings'))?'class="selected"':'';?> href="<?php echo base_url();?>account/colleges">Colleges</a></li>
		            <?php
	                }
	                
	                if(in_array($userdata->user_role, array(3,4))){
	                ?>
		                <li class="filter"><a <?php echo (is_method('indexAccountFacultiesSettings') || is_method('indexAccountFacultiesSettingsAdd'))?'class="selected"':'';?> href="<?php echo base_url();?>account/faculties">Faculties</a></li>
		                <!-- <li class="filter"><a data-type="Cust Offs">Cut Offs</a></li>
		                <li class="filter"><a data-type="Departments">Departments</a></li>
		                <li class="filter"><a <?php echo (is_method('indexAccountScholarshipsSettings'))?'class="selected"':'';?> href="<?php echo base_url();?>account/scholarships">Scholarships</a></li> -->
		                <li class="filter"><a <?php echo (is_method('indexAccountHostelSettings'))?'class="selected"':'';?> href="<?php echo base_url();?>account/hostels">Hostels</a></li>
		                
	                	<?php
	                }

	                ?>
	            </ul>
	        </div>
	    </div>
    </div>
</section>