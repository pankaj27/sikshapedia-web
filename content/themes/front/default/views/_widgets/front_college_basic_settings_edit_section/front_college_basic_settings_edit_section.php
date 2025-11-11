<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="row">
<div class="col-lg-12 mb-4 mb-lg-0" id="gallery_tabs">
	<div class="card userCard">
		<div class="card-header bg-white">
		  <h5 class="m-0 d-inline">College Basic Informations</h5> <small id="user_type" class="form-text text-muted">Update college basic details</small>
		</div>
		<div class="card-body">
			
				<form id="form_basic_info_settings" enctype="multipart/form-data">
					<input type="hidden" name="change_type" value="basic_info_change">
					<div class="row">
						<div class="form-group col-sm-12">
			                <label>College Name <small class="form-text text-muted">(user will view & appear in search)</small></label>
			                <input type="text" class="form-control" id="register_institute_name" name="register_institute_name" aria-describedby="register_institute_name" placeholder="College Name" value="<?php echo (isset($college_profile_data->college_name))?$college_profile_data->college_name:'';?>">
			            </div>
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-6">
	                      <label>College Email <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_institute_email" name="register_institute_email" placeholder="Enter Official Email" value="<?php echo (isset($college_profile_data->college_email))?$college_profile_data->college_email:'';?>">
	                  	</div>
	                  	<div class="form-group col-sm-6">
	                      <label>College Phone no <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_institute_phone_no" name="register_institute_phone_no" aria-describedby="register_institute_phone_no" placeholder="Enter Official Phone No." value="<?php echo (isset($college_profile_data->college_phone_no))?$college_profile_data->college_phone_no:'';?>">
	                  	</div>
			        </div>

			        <div class="row">
	                  	<div class="form-group col-sm-6">
	                      <label>College Alternate Phone no <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_institute_alter_phone_no" name="register_institute_alter_phone_no" aria-describedby="register_institute_alter_phone_no" placeholder="Enter Official Alternate Phone No." value="<?php echo (isset($college_profile_data->college_alter_phone_no))?$college_profile_data->college_alter_phone_no:'';?>">
	                  	</div>
	                  	<div class="form-group col-sm-6">
	                      <label>College Web Address <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_institute_web_address" name="register_institute_web_address" placeholder="Enter Official Webaddress" value="<?php echo (isset($college_profile_data->college_web_address))?$college_profile_data->college_web_address:'';?>">
	                  	</div>
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-6">
			        		<label>College Estd. Year</label>
			                <input type="text" class="form-control" id="register_institute_estd" name="register_institute_estd" aria-describedby="register_institute_estd" placeholder="College Name" value="<?php echo (isset($college_profile_data->college_estd_year))?$college_profile_data->college_estd_year:'';?>">
			        	</div>
			        	<div class="form-group col-sm-6">
		                    <label for="inputState">College Type <span class="span_star">(*)</span></label>
		                    <select class="form-control chosen-select" name="register_institute_type" id="register_institute_type">
		                      <option value="0">Select Type</option>
		                      <?php
		                        if(!empty($institue_types)){
		                          foreach ($institue_types as $key => $value) {
		                            ?>
		                            <option value="<?php echo $value['inst_type'];?>" <?php echo $value['selected'];?>><?php echo $value['inst_type_name'];?></option>
		                            <?php
		                          }
		                        }
		                      ?>					                      
		                    </select>
		                </div>						        	
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-12">
			        		<label for="inputState">College University <span class="span_star">(*)</span></label>
		                    <select class="form-control chosen-select" name="register_institute_university" id="register_institute_university">
		                      <option value="0">Select University</option>
		                      <?php
		                        if(!empty($universities)){
		                          foreach ($universities as $key => $value) {
		                            ?>
		                            <option value="<?php echo $value['university_id'];?>" <?php echo $value['selected'];?>><?php echo $value['university_name'];?></option>
		                            <?php
		                          }
		                        }
		                      ?>					                      
		                    </select>
			        	</div>
			        </div>

			        <div class="row">
			        	<div class="form-group col-sm-12">
			        		<div class="alert alert-info">
								<h6>Higher learning institutes in India are graded for each key aspect/ parameter under four different categories such as 'A', 'B', 'C', and 'D'. The NAAC grade denotes the performance of institutes such as very good, good, satisfactory, and unsatisfactory.</h6>
							</div>
		                    <label for="inputState">College Grades <span class="span_star">(*)</span></label><br>
		                    <?php
							foreach ($grade_types as $key => $value) {
								?>
								<div class="form-check form-check-inline">
									<label class="form-check-label">
										<input type="checkbox" class="form-check-input" value="<?php echo $value['grade_id'];?>" name="register_institute_grades[]" <?php echo $value['selected'];?>>
										<?php echo $value['grade_name'];?>
									<i class="input-frame"></i></label>
								</div>
								<?php
							}
							?>
		                </div>
		            </div>

		            <hr>

		            <div class="row">
			            <div class="form-group col-sm-6">
		                    <label for="inputState">Country <span class="span_star">(*)</span></label>
		                    <select class="form-control chosen-select" name="register_institute_country" id="register_institute_country">
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
		                    <select class="form-control chosen-select" name="register_institute_state" id="register_institute_state">
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
		                    <select class="form-control chosen-select" name="register_institute_district" id="register_institute_district">
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
		                    <select class="form-control chosen-select" name="register_institute_city" id="register_institute_city">
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
		            		<input type="text" class="form-control" id="register_institute_zip_code" name="register_institute_zip_code" aria-describedby="register_institute_zip_code" placeholder="Enter Zipcode" value="<?php echo (isset($college_profile_data->college_zipcode))?$college_profile_data->college_zipcode:'';?>">
		            	</div>
		            	<div class="form-group col-sm-6">
		            		<label for="inputState">Address <span class="span_star">(*)</span></label>
		            		<textarea class="form-control" name="register_institute_address" id="register_institute_address" rows="3" aria-hidden="true"><?php echo (isset($college_profile_data->college_address))?$college_profile_data->college_address:'';?></textarea>
		            	</div>
		            </div>

		            <hr>

		            <div class="row">
		            	<div class="form-group col-sm-12">											
							<label class="control-label"><strong>College Affiliation</strong></label><br>
							<?php
							foreach ($affiliations as $key => $value) {
								?>
								<div class="form-check form-check-inline">
									<label class="form-check-label">
										<input type="checkbox" class="form-check-input" value="<?php echo $value['statutory_body_id'];?>" name="register_institute_affiliations[]" <?php echo $value['selected'];?>>
										<?php echo $value['statutory_body_abbr'];?>
									<i class="input-frame"></i></label>
								</div>
								<?php
							}
							?>
						</div>				            
		            </div>

		            <div class="row">
						<div class="form-group col-sm-12">
							<label class="control-label"><strong>Brief Description About College</strong><small class="form-text text-muted">(will help user to grow their interests.more info will engage them to your college.)</small></label>
							<textarea class="form-control college_info" id="regiter_institute_short_description" rows="10" aria-hidden="true">
								<?php echo $infos->info_value;?>
							</textarea>
						</div>
					</div>

					<div class="row">
						<div class="form-group col-sm-12">
							<label class="control-label"><strong>Broad Description About College</strong><small class="form-text text-muted">(will help user to grow their interests.more info will engage them to your college.)</small></label>
							<textarea class="form-control college_broad_info" id="regiter_institute_broad_description" rows="10" aria-hidden="true">
								<?php echo $infos->info_value_about;?>
							</textarea>
						</div>
					</div>

		            <hr>

		            <div class="row">
		            	<div class="form-group col-sm-12">											
							<label class="control-label"><strong>Facilities Available</strong></label><br>
							<?php
							foreach ($facilities as $key => $value) {
								?>
								<div class="form-check form-check-inline">
									<label class="form-check-label">
										<input type="checkbox" class="form-check-input" value="<?php echo $value['facility_id'];?>" name="register_institute_facilities[]" <?php echo $value['selected'];?>>
										<?php echo $value['facility_name'];?>
									<i class="input-frame"></i></label>
								</div>
								<?php
							}
							?>
						</div>				            
		            </div>

		            <div class="row">
						<div class="form-group col-sm-12">
							<label class="control-label"><strong>Brief About Facilities Available</strong><small class="form-text text-muted">(will help user to grow their interests.more info will engage them to your college.)</small></label>
							<textarea class="form-control college_facilities_info" id="regiter_institute_facilities_info" rows="10" aria-hidden="true">
								<?php echo $infos->info_value_facilities_intro;?>
							</textarea>
						</div>
					</div>

		            <!-- <div class="row">
		            	<div class="col-sm-12">
			               <button type="submit" class="btn btn-primary" id="btn_update_basic_info">Update</button>
			            </div>
		            </div> -->

	            </form>

		</div>
	</div>
</div>
</div>