<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="profile-content py-4">
	<div class="wrapper">
		<div class="row">
			<div class="col-lg-12 mb-4 mb-lg-0" id="general_tabs">
				<div class="card userCard">
					<div class="card-header bg-white">
		        	  <h5 class="m-0 d-inline"><?php echo isset($faculty_id)?'Update':'Add';?> Facultiy <a href="<?php echo base_url();?>account/faculties" class="btn btn-sm btn-primary pull-right">Back</a></h5>
		        	</div>
		        	<div class="card-body">
	        			<form id="form_faculty_settings">
					      	<div class="row">						      	
								<input type="hidden" name="data_type" value="faculty_settings">

								<div class="col-sm-6 col-md-4">
									<div class="form-group">
										<label>Name</label>
						            	<input type="text" class="form-control" id="registration_faculty_name" name="registration_faculty_name" aria-describedby="registration_faculty_name" placeholder="Enter Name" value="<?php echo isset($faculty_data)?$faculty_data->faculty_name:'';?>">
					            	</div>
								</div>
								<div class="col-sm-6 col-md-4">
									<div class="form-group">
										<label>Email</label>
						            	<input type="text" class="form-control" id="registration_faculty_email" name="registration_faculty_email" aria-describedby="registration_faculty_email" placeholder="Enter Email" value="<?php echo isset($faculty_data)?$faculty_data->faculty_email:'';?>">
					            	</div>
								</div>
								<div class="col-sm-6 col-md-4">
									<div class="form-group">
										<label>Phone</label>
						            	<input type="text" class="form-control" id="registration_faculty_phone" name="registration_faculty_phone" aria-describedby="registration_faculty_phone" placeholder="Enter Contact No." value="<?php echo isset($faculty_data)?$faculty_data->facullty_contact_no:'';?>">
					            	</div>
								</div>
								<div class="col-sm-6 col-md-4">
									<div class="form-group">
										<label>Experience</label>
						            	<input type="text" class="form-control" id="registration_faculty_exp" name="registration_faculty_exp" aria-describedby="registration_faculty_exp" placeholder="Enter Contact No." value="<?php echo isset($faculty_data)?$faculty_data->faculty_academic_exp:'';?>">
					            	</div>
								</div>

								<div class="col-sm-6 col-md-4">
					             	<div class="form-group">
						                <label class="d-block">Designation</label>
						                <select class="form-control" name="registration_designation" id="registration_designation">
											<option value="">Select Designation</option>
											<?php
											if(!empty($designations)){
												foreach ($designations as $key => $value) {
													?>
													<option value="<?php echo $value['designation_id'];?>" <?php echo $value['selected'];?>><?php echo $value['designation_name'];?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
					            </div>

								<div class="col-sm-6 col-md-4">
					             	<div class="form-group">
						                <label class="d-block">Department</label>
						                <select class="form-control" name="registration_department" id="registration_department">
											<option value="">Select Department</option>
											<?php
											if(!empty($departments)){
												foreach ($departments as $key => $value) {
													?>
													<option value="<?php echo $value['department_id'];?>" <?php echo $value['selected'];?>><?php echo $value['department_name'];?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
					            </div>

					            <div class="col-sm-6 col-md-4">
									<div class="form-group">
						                <label class="d-block">Qualifications</label>
						                <?php
										if(!empty($qualifications)){
											foreach ($qualifications as $key => $value) {
												?>
												<div class="form-check form-check-inline">
									                <input class="form-check-input" type="checkbox" name="registration_quallifications[]" id="registration_quallifications_<?php echo $key;?>" value="<?php echo $value['qualification_id'];?>" <?php echo $value['selected'];?>>
									                <label class="form-check-label" for="registration_quallifications_<?php echo $key;?>"><?php echo $value['qualification_name'];?></label>
									            </div>
												<?php
											}
										}
										?>						               
									</div>
					            </div>


					            <div class="col-sm-6 col-md-4">
					            	<div class="form-group">
						                <label class="d-block">Subjects</label>
										<?php
										if(!empty($subjects)){
											foreach ($subjects as $key => $value) {
												?>
												<div class="form-check form-check-inline">
									                <input class="form-check-input" type="checkbox" name="registration_subjects[]" id="registration_subjects_<?php echo $key;?>" value="<?php echo $value['subject_id'];?>" <?php echo $value['selected'];?>>
									                <label class="form-check-label" for="registration_subjects_<?php echo $key;?>"><?php echo $value['subject_name'];?></label>
									            </div>
												<?php
											}
										}
										?>
									</div>
					            </div>

					            <div class="col-sm-12">
						           <button type="submit" class="btn btn-primary" id="btn_update_faculty"><?php echo isset($faculty_id)?'Update':'Add';?></button>
						        </div>
							    
							</div>
						</form>
		        	</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">let _faculty='<?php echo isset($faculty_id)?$faculty_id:'';?>';let page='hostel_edit';let m_row='<?php echo isset($i)?$i:'0';?>';let wm_row='<?php echo isset($j)?$j:'0';?>';</script>