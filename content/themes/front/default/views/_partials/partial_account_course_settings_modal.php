<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="modal fade logRegModal" id="courseRegModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
    	<div class="logSignSec">
    		<div class="head d-flex align-items-center justify-content-between">
	          <h5>Add Course & Fees Settings</h5>
	          <ul class="nav flex-row">
	              <li class="nav-item ">
	                <button class="nav-link btn" href="#" data-dismiss="modal" aria-label="Close"><span class="fas fa-times"></span></button>
	              </li>
	          </ul>
	        </div>
	        <div class="logSignContent">
	        	<!-- <div class="secLeft"></div> -->
	        	<div class="secFull">
	        		<div class="secInner">
	        			<form id="form_course_settings">
					      	<div class="row">						      	
								<input type="hidden" name="data_type" value="course_settings">
								<div class="col-sm-6">
									<div class="form-group">
										<label>Course Name</label>
						            	<select class="form-control" id="registration_course" name="registration_course" >
						            		<option value="">Select Course to Add</option>
											<?php
							            	if(!empty($courses)){
							            		foreach ($courses as $key => $value) {
							            			?>
							            			<option value="<?php echo $value['course_id'];?>"><?php echo $value['course_name'];?></option>
							            			<?php
							            		}
							            	}
							            	?>
						            	</select>
							            	
					            	</div>
								</div>

								<div class="col-sm-3">
									<div class="form-group">
										<label>Course Duration (Years)</label>
						            	<select class="form-control" id="registration_course_duration_years" name="registration_course_duration_years">
						            		<option value="">Course Duration (Years)</option>
											<?php
							            	if(!empty($course_duration_years)){
							            		foreach ($course_duration_years as $key => $value) {
							            			?>
							            			<option value="<?php echo $value;?>"><?php echo $value;?></option>
							            			<?php
							            		}
							            	}
							            	?>
						            	</select>								            	
					            	</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label>Course Duration (Months)</label>
						            	<select class="form-control" id="registration_course_duration_months" name="registration_course_duration_months">
						            		<option value="">Course Duration (Months)</option>
											<?php
							            	if(!empty($course_duration_months)){
							            		foreach ($course_duration_months as $key => $value) {
							            			?>
							            			<option value="<?php echo $value;?>"><?php echo $value;?></option>
							            			<?php
							            		}
							            	}
							            	?>
						            	</select>						            	
					            	</div>
								</div>

								<div class="col-sm-3">
									<div class="form-group">
										<label>Course Duration Type</label>
						            	<select class="form-control" id="registration_course_duration_type" name="registration_course_duration_type" >
						            		<option value="">Select Course Duration Type</option>
											<?php
							            	if(!empty($duration_types)){
							            		foreach ($duration_types as $key => $value) {
							            			?>
							            			<option value="<?php echo $value;?>"><?php echo $value;?></option>
							            			<?php
							            		}
							            	}
							            	?>
						            	</select>							            	
					            	</div>
								</div>

								<div class="col-sm-3">
									<div class="form-group">
										<label>Course Type</label>
						            	<select class="form-control" id="registration_course_type" name="registration_course_type" >
						            		<option value="">Select Course Type</option>
											<?php
							            	if(!empty($course_types)){
							            		foreach ($course_types as $key => $value) {
							            			?>
							            			<option value="<?php echo $value;?>"><?php echo $value;?></option>
							            			<?php
							            		}
							            	}
							            	?>
						            	</select>
							            	
					            	</div>
								</div>

								<div class="col-sm-3">
									<div class="form-group">
										<label>Course Pass Type</label>
						            	<select class="form-control" id="registration_course_pass_type" name="registration_course_pass_type" >
						            		<option value="">Select Course Pass Type</option>
											<?php
							            	if(!empty($course_pass_types)){
							            		foreach ($course_pass_types as $key => $value) {
							            			?>
							            			<option value="<?php echo $value;?>"><?php echo $value;?></option>
							            			<?php
							            		}
							            	}
							            	?>
						            	</select>
							            	
					            	</div>
								</div>

								<div class="col-sm-3">
									<div class="form-group">
										<label>Placement Type</label>
						            	<select class="form-control" id="registration_course_placement_type" name="registration_course_placement_type" >
						            		<option value="">Select Placement Type</option>
											<?php
							            	if(!empty($placement_types)){
							            		foreach ($placement_types as $key => $value) {
							            			?>
							            			<option value="<?php echo $value;?>"><?php echo $value;?></option>
							            			<?php
							            		}
							            	}
							            	?>
						            	</select>	
					            	</div>
								</div>

								<div class="col-sm-12">
									<div class="form-group">
										<label>Course Cost (In general)</label>
										<div class="table-responsive">
							                <table class="table" id="course_price_list_table">
							                    <thead>
								                    <tr>
								                        <th>Year</th>
								                        <th>Tuition Fees(<?php echo $user_currency;?>)</th>
								                        <th>Admission Fees(<?php echo $user_currency;?>)</th>
								                        <th>Registration Fees(<?php echo $user_currency;?>)</th>
								                        <th>Exam Fees(<?php echo $user_currency;?>)</th>
								                        <th>Other Fees(<?php echo $user_currency;?>)</th>
								                    </tr>
								                </thead>
								                <tbody>
								                </tbody>
							                </table>
							            </div>
						        	</div>
								</div>

					            <div class="col-sm-12">
						           <button type="submit" class="btn btn-primary" id="btn_update_course">Add</button>
						        </div>
							    
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
    </div>
  </div>
</div>