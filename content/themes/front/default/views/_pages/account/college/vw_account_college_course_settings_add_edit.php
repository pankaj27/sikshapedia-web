<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="profile-content py-4">
	<div class="wrapper">
		<div class="row">
			<div class="col-lg-12 mb-4 mb-lg-0" id="info_tabs">
				<div class="card userCard">
					<div class="card-header bg-white">
					  <h5 class="m-0 d-inline">Course & Fees Settings <a href="<?php echo base_url();?>account/course" class="btn btn-sm btn-primary pull-right">Back</a></h5>
					</div>
					<div class="card-body">

							<form id="form_course_settings">
						      	<div class="row">						      	
									<div class="col-sm-6 col-md-4">
										<div class="form-group">
											<label>Course Name</label>
							            	<select class="form-control" id="registration_course" name="registration_course" >
							            		<option value="">Select Course to Add</option>
												<?php
								            	if(!empty($courses)){
								            		foreach ($courses as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_id'];?>" <?php echo $value['selected'];?>><?php echo $value['course_name'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>
								            	
						            	</div>
									</div>

									<div class="col-sm-6 col-md-4">
										<div class="form-group">
											<label>Course Duration (Years)</label>
							            	<select class="form-control" id="registration_course_duration_years" name="registration_course_duration_years">
							            		<option value="">Course Duration (Years)</option>
												<?php
								            	if(!empty($course_duration_years)){
								            		foreach ($course_duration_years as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_duration_year'];?>" <?php echo $value['selected'];?>><?php echo $value['course_duration_year'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>								            	
						            	</div>
									</div>
									<div class="col-sm-6 col-md-4">
										<div class="form-group">
											<label>Course Duration (Months)</label>
							            	<select class="form-control" id="registration_course_duration_months" name="registration_course_duration_months">
							            		<option value="">Course Duration (Months)</option>
												<?php
								            	if(!empty($course_duration_months)){
								            		foreach ($course_duration_months as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_duration_month'];?>" <?php echo $value['selected'];?>><?php echo $value['course_duration_month'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>						            	
						            	</div>
									</div>

									<div class="col-sm-6 col-md-4">
										<div class="form-group">
											<label>Course Duration Type</label>
							            	<select class="form-control" id="registration_course_duration_type" name="registration_course_duration_type" >
							            		<option value="">Select Course Duration Type</option>
												<?php
								            	if(!empty($duration_types)){
								            		foreach ($duration_types as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['duration_type'];?>" <?php echo $value['selected'];?>><?php echo $value['duration_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>							            	
						            	</div>
									</div>

									<div class="col-sm-6 col-md-4">
										<div class="form-group">
											<label>Course Type</label>
							            	<select class="form-control" id="registration_course_type" name="registration_course_type" >
							            		<option value="">Select Course Type</option>
												<?php
								            	if(!empty($course_types)){
								            		foreach ($course_types as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_type'];?>" <?php echo $value['selected'];?>><?php echo $value['course_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>
								            	
						            	</div>
									</div>

									<div class="col-sm-6 col-md-4">
										<div class="form-group">
											<label>Course Pass Type</label>
							            	<select class="form-control" id="registration_course_pass_type" name="registration_course_pass_type" >
							            		<option value="">Select Course Pass Type</option>
												<?php
								            	if(!empty($course_pass_types)){
								            		foreach ($course_pass_types as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_pass_type'];?>" <?php echo $value['selected'];?>><?php echo $value['course_pass_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>
								            	
						            	</div>
									</div>

									<div class="col-sm-6 col-md-4">
										<div class="form-group">
											<label>Placement Type</label>
							            	<select class="form-control" id="registration_course_placement_type" name="registration_course_placement_type" >
							            		<option value="">Select Placement Type</option>
												<?php
								            	if(!empty($placement_types)){
								            		foreach ($placement_types as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['placement_type'];?>" <?php echo $value['selected'];?>><?php echo $value['placement_type'];?></option>
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
									                	<?php
									                	$i=1;
									                	if(!empty($course_data_costs))
									                		foreach ($course_data_costs as $key => $value) {
									                			?>
									                			<tr>
									                				<td><?php echo ordinal($value->user_course_year);?> Year <input type="hidden" name="registration_course_fees[<?php echo $i;?>][course_year]" value="<?php echo $value->user_course_year;?>"></td>
									                				<td>
									                					<table class="table">
									                						<tbody>
									                							<tr>
									                								<td><label>Semester 1</label>
									                								<input type="number" min="0" class="valid" value="<?php echo $value->user_course_tution_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_tution_fee_sem_1]"></td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_tution_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_tution_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                				<td>
									                					<table>
									                						<tbody>
									                							<tr>
									                								<td>
									                									<label>Semester 1</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_admisssion_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_admisssion_fee_sem_1]">
									                								</td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_admisssion_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_admisssion_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                				<td>
									                					<table>
									                						<tbody>
									                							<tr>
									                								<td>
									                									<label>Semester 1</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_reg_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_reg_fee_sem_1]">
									                								</td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_reg_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_reg_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                				<td>
									                					<table>
									                						<tbody>
									                							<tr>
									                								<td>
									                									<label>Semester 1</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_exam_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_exam_fee_sem_1]">
									                								</td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_exam_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_exam_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                				<td>
									                					<table>
									                						<tbody>
									                							<tr>
									                								<td>
									                									<label>Semester 1</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_other_fee_sem_1;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_other_fee_sem_1]">
									                								</td>
									                							</tr>
									                							<tr>
									                								<td>
									                									<label>Semester 2</label>
									                									<input type="number" min="0" class="" value="<?php echo $value->user_course_other_fee_sem_2;?>" aria-invalid="false" name="registration_course_fees[<?php echo $i;?>][course_other_fee_sem_2]">
									                								</td>
									                							</tr>
									                						</tbody>
									                					</table>
									                				</td>
									                			</tr>
									                			<?php
									                			$i++;
									                		}
									                	?>
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
			<!-- <div class="col-lg-3 ">
				
			</div> -->
		</div>
	</div>
</div>
<script type="text/javascript">
	var user_currency_symbol_side='<?php echo $user_currency_symbol_side;?>';
	var currency='<?php echo $user_currency;?>';
	var _course='';
</script>