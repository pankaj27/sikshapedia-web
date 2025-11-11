

<div class="row">
	<div class="col-lg-12">
		<div class="card userCard" style="border:none !important;">
			<form id="from_student_basic_details">
			<div class="card-header bg-white text-center" style="border:none !important;"><h4 class="m-0 d-inline">HELPS US KNOW YOU BETTER</h4></div>
			<div class="card-body">
				
					<div class="row">
						<div class="form-group col-sm-12">
				            <label>Name  <span class="span_star">(*)</span></label>
				            <input type="text" class="form-control" id="registration_full_name" name="registration_full_name" aria-describedby="registration_full_name" placeholder="Your Full Name" value="<?php echo (isset($userdata->user_fullname))?$userdata->user_fullname:'';?>" >
				        </div>
				    </div>

			        <div class="row">
						<div class="form-group col-sm-4">
			                <label>Email  <span class="span_star">(*)</span><small class="form-text text-muted">(valid email id to get updates)</small></label>
			                <input type="text" class="form-control" id="registration_email" name="registration_email" aria-describedby="registration_email" placeholder="Email Address" value="<?php echo (isset($userdata->user_email))?$userdata->user_email:'';?>">
			            </div>
			        
						<div class="form-group col-sm-4">
			                <label>Phone No  <span class="span_star">(*)</span><small class="form-text text-muted">(valid phone no to get updates)</small></label>
			                <input type="text" class="form-control" id="registration_phone_no" name="registration_phone_no" aria-describedby="registration_phone_no" placeholder="Phone No" value="<?php echo (isset($userdata->user_phone_no))?$userdata->user_phone_no:'';?>">
			            </div>

			            <div class="form-group col-sm-4">
			                <label>Alternate Phone No <small class="form-text text-muted">(valid phone no to get updates)</small></label>
			                <input type="text" class="form-control" id="registration_alternate_phone_no" name="registration_alternate_phone_no" aria-describedby="registration_alternate_phone_no" placeholder="Alternate Phone No" value="<?php echo (isset($userdata->user_alter_contact))?$userdata->user_alter_contact:'';?>">
			            </div>
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-4">
                            <label class="d-block">Gender</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" <?php echo (!empty($userdata->user_gender) && ($userdata->user_gender=='1'))?'checked':'';?>  id="Male" name="registration_gender" value="1">
                                <label class="form-check-label" for="Male">Male</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" <?php echo (!empty($userdata->user_gender) && ($userdata->user_gender=='2'))?'checked':'';?>  id="Female" name="registration_gender" value="2">
                                <label class="form-check-label" for="Female">Female</label>
                            </div>
                        </div>
                        <div class="form-group col-sm-4">
			                <label>Date of Birth</label>
			                <input type="text" class="form-control" id="registration_dob" name="registration_dob" aria-describedby="registration_dob" placeholder="Date of Birth" value="<?php echo (isset($userdata->user_dob))?date('d-m-Y',strtotime($userdata->user_dob)):'';?>">
			            </div>
			            <div class="form-group col-sm-4">
			                <label>Passing Year</label>
			                <input type="text" class="form-control" id="registration_yop" name="registration_yop" aria-describedby="registration_yop" placeholder="Year of Passing" value="<?php echo (isset($userdata->user_year_of_passing))?$userdata->user_year_of_passing:'';?>">
			            </div>
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-6">
		                    <label for="inputState">Country <span class="span_star">(*)</span></label>
		                    <select class="form-control chosen-select" name="registration_country" id="registration_profile_country">
		                      <option value="0">Select Country</option>
		                      <?php
		                        if(!empty($countries)){
		                          foreach ($countries as $key => $value) {
		                            ?>
		                            <option value="<?php echo $value['country_id'];?>" <?php echo $value['selected'];?>><?php echo $value['country_name'];?></option>
		                            <?php
		                          }
		                        }
		                      ?>
		                    </select>
		                </div>

		                <div class="form-group col-sm-6">
		                    <label for="inputState">State <span class="span_star">(*)</span></label>
		                    <select class="form-control chosen-select" name="registration_state" id="registration_profile_state">
		                      <option value="0">Select State</option>
		                      <?php
		                        if(!empty($states)){
		                          foreach ($states as $key => $value) {
		                            ?>
		                            <option value="<?php echo $value['state_id'];?>" <?php echo $value['selected'];?>><?php echo $value['state_name'];?></option>
		                            <?php
		                          }
		                        }
		                      ?>
		                    </select>
		                </div>
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-6">
		                    <label for="inputState">District <span class="span_star">(optional)</span></label>
		                    <select class="form-control chosen-select" name="registration_district" id="registration_profile_district">
		                      <option value="0">Select District</option>
		                      <?php
		                        if(!empty($districts)){
		                          foreach ($districts as $key => $value) {
		                            ?>
		                            <option value="<?php echo $value['district_id'];?>" <?php echo $value['selected'];?>><?php echo $value['district_name'];?></option>
		                            <?php
		                          }
		                        }
		                      ?>
		                    </select>
		                </div>

		                <div class="form-group col-sm-6">
		                    <label for="inputState">City <span class="span_star">(*)</span></label>
		                    <select class="form-control chosen-select" name="registration_city" id="registration_profile_city">
		                      <option value="0">Select City</option>
		                      <?php
		                        if(!empty($cities)){
		                          foreach ($cities as $key => $value) {
		                            ?>
		                            <option value="<?php echo $value['city_id'];?>" <?php echo $value['selected'];?>><?php echo $value['city_name'];?></option>
		                            <?php
		                          }
		                        }
		                      ?>
		                    </select>
		                </div>
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-6">
		            		<label for="inputState">Zip Code <span class="span_star">(*)</span></label>
		            		<input type="text" class="form-control" id="registration_zipcode" name="registration_zipcode" aria-describedby="registration_zipcode" placeholder="Enter Zipcode" value="<?php echo (isset($userdata->user_pincode))?$userdata->user_pincode:'';?>">
		            	</div>
		            	<div class="form-group col-sm-6">
		            		<label for="inputState">Address <span class="span_star">(*)</span></label>
		            		<textarea class="form-control" name="registration_address" id="registration_address" rows="3" aria-hidden="true"><?php echo (isset($userdata->user_address))?$userdata->user_address:'';?></textarea>
		            	</div>
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-12">
		            		<label for="inputState">About Yourself <span class="span_star">(*)</span></label>
		            		<textarea class="form-control" name="registration_about_yourself" id="registration_about_yourself" rows="3" aria-hidden="true"><?php echo (isset($userdata->user_brief))?$userdata->user_brief:'';?></textarea>
		            	</div>
			        </div>
				
			</div>
			<div class="card-footer bg-white" style="border:none !important;">
				<div class="row">
				    <div class="form-group col-sm-12">
						<button type="submit" class="btn btn-primary" id="btn_update_stubasic_info" style="float:right;">Update</button>
					</div>
				</div>
			</div>

			</form>
		</div>
	</div>
</div>