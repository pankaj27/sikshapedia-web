<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<section class="isa-filter-result filter-is-visible" id="exams_list">

	<?php
	if(!empty($exams_list)){
		foreach ($exams_list as $key => $value) {
			?>
			<div class="card examListCard mb-3">
	            <div class="card-header bg-white">
	                <div class="row">
	                    <div class="col-sm-6">
	                        <div class="media">
	                            <img src="<?php echo $value['exam_logo'];?>" class="mr-3 shadow-sm w-60p" alt="<?php echo $value['exam_full_name'];?>">
	                            <div class="media-body">
	                            	<?php
	                            	if(!empty($value['exam_mode'])){
	                            		?>
	                            		<div class="d-flex mb-1 examLabels">
		                            		<?php
		                            		foreach ($value['exam_mode'] as $k => $v) {
		                            			?>
		                            			<div  class="bg-indigo text-white px-1 mr-2 f10 examLabel"><?php echo $v;?></div>
		                            			<?php
		                            		}
		                            		?>
	                            		</div>
	                            		<?php
	                            	}
	                            	?>
	                              <h6 class="mt-0 mb-1"> <?php echo $value['exam_year_short_name'];?></h6>
	                              <small><?php echo $value['exam_full_name'];?></small>
	                            </div>
	                        </div>
	                    </div>
	                    <div class="col-sm-6">
	                        <div class="row form-row">
	                        	<?php
	                        	if(!empty($value['exam_application_form_dates'])){
	                        		?>
	                        		<div class="col">
		                                <div class="examDatesInfo">
		                                	<?php
		                                	if($value['exam_application_form_dates']['dates_active']=='1'){
		                                		?>
		                                		<div class="examLabel">Application is comming up</div>
		                                		<?php
		                                	}
		                                	?>
		                                     
		                                    <p class="m-0"><small><?php echo $value['exam_application_form_dates']['start_date'];?> - <?php echo $value['exam_application_form_dates']['end_date'];?></small> </p>
		                                    <b class="color-teal"> application form</b>
		                                </div>
		                            </div>
	                        		<?php
	                        	}


	                        	if(!empty($value['exam_dates'])){
	                        		?>
	                        		<div class="col">
		                                <div class="examDatesInfo">
		                                	<?php
		                                	if($value['exam_dates']['dates_active']=='1'){
		                                		?>
		                                		<div class="examLabel">Examination is comming up</div>
		                                		<?php
		                                	}
		                                	?>
		                                    <p class="m-0"><small><?php echo $value['exam_dates']['start_date'];?> - <?php echo $value['exam_dates']['end_date'];?></small> </p>
		                                    <b class="color-teal"> examination</b>
		                                </div>
		                            </div>
	                        		<?php
	                        	}


	                        	if(!empty($value['exam_result_dates'])){
	                        		?>
	                        		<div class="col">
		                                <div class="examDatesInfo">
		                                    <p class="m-0"><small><?php echo $value['exam_result_dates']['start_date'];?> - <?php echo $value['exam_result_dates']['end_date'];?></small> </p>
		                                    <b class="color-teal"> application form</b>
		                                </div>
		                            </div>
	                        		<?php
	                        	}

	                        	?>
	                           
		                            
		                            
	                        </div>
	                    </div>
	                </div>
	            </div>
	            <div class="card-body">
	               <?php echo $value['exam_desc'];?>
	            </div>
	            <?php
	            if(!empty($value['exam_menues'])){
	            	?>
	            	<div class="card-footer bg-white">
	            		<?php
	            		foreach ($value['exam_menues'] as $k => $v) {
	            			?>
	            			<a href="<?php echo $v['menu_link'];?>" class="btn btn-light btn-sm"><?php echo $v['menu_name'];?></a>
	            			<?php
	            		}
	            		?>
		                <!-- <a href="" class="btn btn-primary btn-sm"> APPLY NOW</a> -->
		            </div>
	            	<?php
	            }

	            ?>
		            
	        </div>
			<?php
		}
	}


	?>

             
         

          
          <!-- <div class="text-center"><a href="" class="btn-temp ">Explore All</a></div> -->
      </section>