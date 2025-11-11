<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Ads List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Ads</h6>
					<div class="col-md-12">
						<form id="form_ads_add_edit">
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="row">
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Ads Category</label>
										<select class="form-control" name="ads_package_category">
											<option value="0">Select category</option>
											<?php
											if(!empty($ads_categories)){
												foreach ($ads_categories as $key => $value) {
													?>
													<option value="<?php echo $value->package_category_id;?>"><?php echo $value->package_category_name;?></option>
													<?php
												}
											}

											?>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Ads Positions/Types</label>
										<select class="form-control" name="ads_package_type">
											<option value="0">Select Position/Type</option>
											<?php
											if(!empty($ads_positions)){
												foreach ($ads_positions as $key => $value) {
													?>
													<option value="<?php echo $value['pacakge_type_id'];?>"><?php echo $value['package_name'];?></option>
													<?php
												}
											}

											?>
										</select>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Client Type</label>
										<select class="form-control" name="ads_package_client_type" id="ads_package_client_type">
											<option value="0">Select Type</option>
											<option value="1">Existing College</option>
											<option value="2">New College</option>
											<!-- <option value="3">Existing University</option>
											<option value="4">New University</option> -->
										</select>
									</div>
								</div>
							</div>
							<h5>Ads Client</h5><hr>
							<div class="row" id="ads_colleges_div_1">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">College Name</label>
										<select class="form-control" name="ads_package_client" id="ads_package_client">
											<option value="0">Select Client</option>
											<?php
											if(!empty($ads_colleges)){
												foreach ($ads_colleges as $key => $value) {
													?>
													<option value="<?php echo $value['college_id'];?>"><?php echo $value['college_name'];?></option>
													<?php
												}
											}

											?>
										</select>
									</div>
								</div>
							</div>
							<div id="ads_colleges_div_2" style="display: none;">
								<div class="row">
									<div class="col-sm-4">
										<div class="form-group">
											<label class="control-label">College Name</label>
											<input type="text" class="form-control" placeholder="Enter name" name="ads_college_name" id="ads_college_name" value="<?php echo (!empty($college_data))?$college_data['college_name']:'';?>">
										</div>
									</div>							
									<div class="col-sm-4">
										<div class="form-group">
											<label class="control-label">College Email</label>
											<input type="text" class="form-control" placeholder="Enter official email" name="ads_college_email" id="ads_college_email" value="<?php echo (!empty($college_data))?$college_data['college_email']:'';?>">
										</div>
									</div>
									<div class="col-sm-4">
										<div class="form-group">
											<label class="control-label">College Phone No.</label>
											<input type="text" class="form-control" placeholder="Enter official phone no." name="ads_college_phone" id="ads_college_phone" value="<?php echo (!empty($college_data))?$college_data['college_phone_no']:'';?>">
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-4">
										<div class="form-group">
											<label class="control-label">College Contact Person Name</label>
											<input type="text" class="form-control" placeholder="Enter contact person name" name="ads_college_contact_person_name" id="ads_college_contact_person_name" value="<?php echo (!empty($college_data))?$college_data['college_name']:'';?>">
										</div>
									</div>							
									<div class="col-sm-4">
										<div class="form-group">
											<label class="control-label">College Contact Person Email</label>
											<input type="text" class="form-control" placeholder="Enter contact person official email" name="ads_college_contact_person_email" id="ads_college_contact_person_email" value="<?php echo (!empty($college_data))?$college_data['college_email']:'';?>">
										</div>
									</div>
									<div class="col-sm-4">
										<div class="form-group">
											<label class="control-label">College Contact Person Phone No.</label>
											<input type="text" class="form-control" placeholder="Enter contact person official phone no." name="ads_college_contact_person_phone" id="ads_college_contact_person_phone" value="<?php echo (!empty($college_data))?$college_data['college_phone_no']:'';?>">
										</div>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Ads External Link</label>
										<input type="text" class="form-control" placeholder="Enter Link" name="ads_external_link" id="ads_external_link" value="">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label>Ads Image</label>
										<input type="file" name="ads_image" class="file-upload-default">
										<div class="input-group col-xs-12">
											<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
											<span class="input-group-append">
												<button class="file-upload-browse btn btn-primary" type="button">Browse Image</button>
											</span>
										</div>
									</div>
								</div>
							</div>

							<h5>Ads Visibility in Countries</h5><hr>
							<div class="row">
								
										
											<?php
											if(!empty($ads_countries)){
												foreach ($ads_countries as $key => $value) {
													?>
													<div class="col-sm-3">
														<div class="form-group">
															<?php
															foreach ($value as $k => $v) {
																?>
																<input type="checkbox" name="college_country[]" value="<?php echo $v['country_id'];?>" <?php echo $v['selected'];?>> <span><?php echo $v['country_name'];?></span><br>
																<?php
															}

															?>
															
														</div>
													</div>
													<?php
												}
											}

											?>
									
							</div>
							<div class="row">
								<div class="col-sm-3">
									<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_ads">Save</button>
								</div>
							</div>
						</form>
					</div>	
				</div>
			</div>
		</div>
	</div>
</div>