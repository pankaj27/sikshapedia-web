<?php defined('BASEPATH') OR exit('No direct script access allowed');?>




	<?php
	if(!empty($exams_list)){
		$i=1;
		foreach ($exams_list as $key => $value) {

			foreach ($value as $k => $v) {
				
				?>
				<div class="card examListCard mb-3 exam_list_view_wrapper exam_list_view">
		            <div class="card-header bg-white">
		                <div class="row">
		                    <div class="col-sm-6">
		                        <div class="media">
		                        	
			                        <a href="<?php echo $v['exam_link'];?>"><img src="<?php echo $v['exam_logo'];?>" class="mr-3 shadow-sm w-60p" alt="<?php echo $v['exam_full_name'];?>"></a>
		                            <div class="media-body">
		                            	<?php
		                            	if(!empty($v['exam_mode'])){
		                            		?>
		                            		<div class="d-flex mb-1 examLabels">
			                            		<?php
			                            		foreach ($v['exam_mode'] as $_k => $_v) {
			                            			if($_v!=''){
			                            				?>
				                            			<div class="bg-gray text-white px-1 mr-2 f10 examLabel" style="border-radius: 89px;padding: 4px 5px;color:#9d9d9d;"><span class="text-gray"><?php echo $_v;?></span></div>
				                            			<?php
			                            			}
			                            			
			                            		}
			                            		?>
		                            		</div>
		                            		<?php
		                            	}
		                            	?>
		                              <h6 class="mt-0 mb-1" style="font-size: 26.7px;font-weight: 900;"> <a href="<?php echo $v['exam_link'];?>" style="color: #4d586c;"><?php echo $v['exam_short_name'];?></a></h6>
		                              <span class="d-block text-uppercase text-sm font-weight-semi text-sidebar-heading"><a href="<?php echo $v['exam_link'];?>" style="color:#4d586c;font-size: 12px;"><?php echo $v['exam_full_name'];?></a></span>
		                            </div>
		                        	
		                        </div>
		                    </div>
		                    <div class="col-sm-6">
		                        <div class="row form-row">
		                        	<?php
		                        	if(!empty($v['exam_application_form_dates'])){
		                        		?>
		                        		<div class="col">
			                                <div class="examDatesInfo">
			                                	<?php
			                                	if($v['exam_application_form_dates']['dates_active']=='1'){
			                                		?>
			                                		<div class="examLabel" style="font-size:12px;color:#000;background-color:#ffc100;box-shadow: 0 2px 2px 0 rgb(0 0 0 / 10%);">Application is comming up</div>
			                                		<?php
			                                	}
			                                	?>
			                                     
			                                    <p class="m-0"><small><?php echo $v['exam_application_form_dates']['formatted_date'];?></small> </p>
			                                    <b class="color-blue"> application form</b>
			                                </div>
			                            </div>
		                        		<?php
		                        	}


		                        	if(!empty($v['exam_dates'])){
		                        		?>
		                        		<div class="col">
			                                <div class="examDatesInfo">
			                                	<?php
			                                	if($v['exam_dates']['dates_active']=='1'){
			                                		?>
			                                		<div class="examLabel" style="font-size:12px;color:#000;background-color:#ffc100;box-shadow: 0 2px 2px 0 rgb(0 0 0 / 10%);">Examination is comming up</div>
			                                		<?php
			                                	}
			                                	?>
			                                    <p class="m-0"><small>
			                                    	<?php echo $v['exam_dates']['exam_formatted_date'];?></small> 

			                                    </p>
			                                    <b class="color-teal"> examination</b>
			                                </div>
			                            </div>
		                        		<?php
		                        	}


		                        	if(!empty($v['exam_result_dates'])){
		                        		?>
		                        		<div class="col">
			                                <div class="examDatesInfo">
			                                	<?php
			                                	if($v['exam_result_dates']['dates_active']=='1'){
			                                		?>
			                                		<div class="examLabel" style="font-size:12px;color:#000;background-color:#ffc100;box-shadow: 0 2px 2px 0 rgb(0 0 0 / 10%);">Result is comming up</div>
			                                		<?php
			                                	}
			                                	?>
			                                    <p class="m-0"><small><?php echo $v['exam_result_dates']['exam_formatted_date'];?></small> </p>
			                                    <b class="color-pink"> result announce</b>
			                                </div>
			                            </div>
		                        		<?php
		                        	}

		                        	?>
		                           
			                            
			                            
		                        </div>
		                    </div>
		                </div>
		            </div>
		            <?php
		            if(!empty($v['exam_year_desc'])){
		            	?>
		            	<div class="card-body text-gray font-italic">
		               		<?php echo $v['exam_year_desc'];?>
		            	</div>
		            	<?php
		            }
		            ?>
		            
		            <div class="card-footer bg-white">
		             <?php
		            if(!empty($v['exam_menues'])){
		            	?>
		            	
		            		<?php
		            		foreach ($v['exam_menues'] as $_k => $_v) {
		            			?>
		            			<a href="<?php echo $_v['menu_link'];?>" class="btn btn-warning btn-sm" target="_blank" style="color:#ffffff;background-color:#ff7900;border-color: #ff7900;margin-top: 5px;"><?php echo $_v['menu_name'];?></a>
		            			<?php
		            		}
		            		?>
			                <!-- <a href="" class="btn btn-primary btn-sm"> APPLY NOW</a> -->
			               
		            	<?php
		            }else{
		            	?>
		            	<a href="<?php echo $v['exam_link'];?>"  target="_blank" class="btn btn-primary btn-sm" style="margin-top: 5px;">DETAILS</a>
		            	<?php
		            }

		            ?>
		             
			        </div>
		            
	        	</div>
				<?php
			}

		
			?>
			<!--ads block-->
			<?php
			

			$i++;
		}
	}else{
		?>
		<div class="card examListCard mb-3 exam_list_view_wrapper exam_list_view">
			<div class="card-header bg-white">
				<div class="row">
					<div class="col-lg-12 text-center"><img src="https://static.waytoadmissions.com/data/app/app_data/2953962.jpg" alt="" width="50%;"></div>
				</div>
			</div>
		</div>
		<?php
	}
	?>
	  
    <!-- <div class="text-center"><a href="" class="btn-temp ">Explore All</a></div> -->




