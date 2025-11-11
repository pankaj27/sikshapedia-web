<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">System User's List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Users</h6>
					<div class="col-md-12">
						<div class="table-responsive">
							<!-- <div>
						        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
						    </div> -->
							<table id="user_list_table" class="table">
								<thead>
			                      <tr>
			                        <th>#</th>
			                        <th>User Name</th>
			                        <th>Full Name</th>
			                        <th>Phone No.</th>
			                        <th>Email</th>			                        
			                        <th>Upload Quota/Month</th>
			                        <th>Amount/upload</th>
			                        <th>Status</th>
			                        <th>Action  
			                        	<?php
			                        	if($userdata->user_role=='1'){
			                        		?>
			                        		<button class="btn btn-xs btn-primary" data-toggle="modal" data-target="#userRegModal">Add</button>
			                        		<?php
			                        	} 
			                        	?>
			                        </th>
			                      </tr>
			                    </thead>
			                    <tbody>		                    	
			                    </tbody>
							</table>
						</div>
					</div>	
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade bd-example-modal-xl" id="userRegModal" tabindex="-1" role="dialog" aria-labelledby="userRegModal" aria-hidden="true">
	    <div class="modal-dialog modal-xl" role="document">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="userRegModal">System Users</h5>
	                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	            </div>
	            <form id="form_system_users">
		            <div class="modal-body">	            	
		            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            		<input type="hidden" class="form-control" name="input_user" id="input_user" value="">
		            		<div class="row">
		            			<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">Full Name</label>
										<input type="text" class="form-control" placeholder="Enter full name" name="input_full_name" id="input_full_name" value="">
									</div>
								</div>
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">Email Address</label>
										<input type="text" class="form-control" placeholder="Enter email address" name="input_user_email" id="input_user_email" value="">
									</div>
								</div>
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">Phone No</label>
										<input type="text" class="form-control" placeholder="Enter phone no.s" name="input_user_phone" id="input_user_phone" value="">
									</div>
								</div>
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">System Login User Name</label>
										<input type="text" class="form-control" placeholder="Enter user name" name="input_user_name" id="input_user_name" value="">
									</div>
								</div>								
							</div>
		            		<div class="row">
		            			<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">User Gender</label>
										<select class="form-control" name="input_user_gender" id="input_user_gender">
											<option value="1">Male</option>
											<option value="2">Female</option>
										</select>
									</div>
								</div>
		            			
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">User Password</label>
										<div class="input-group">
											<input type="text" class="form-control" placeholder="Enter user password" name="input_user_password" id="input_user_password" value="">
											<button class="btn btn-primary" id="btn_gen_pass">Generate</button>
										</div>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">User Type</label>
										<select class="form-control" name="input_user_type" id="input_user_type">
											<option value="2">Admin</option>
											<option value="5">Data Entry Operator</option>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">User DOB</label>
										<input type="text" class="form-control" placeholder="Enter user DOB" name="input_user_dob" id="input_user_dob" value="">
									</div>
								</div>							
							</div>
							<div class="row">
		            			<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">User Country</label>

										<select class="form-control" name="input_user_country" id="input_user_country">
											<?php
											if(!empty($countries)){
												foreach ($countries as $key => $value) {
													?>
													<option value="<?php echo $value['country_id'];?>"><?php echo $value['country_name'];?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
								</div>		            			
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">User State</label>
										<select class="form-control" name="input_user_state" id="input_user_state">
											<?php
											if(!empty($states)){
												?>
												<option value="0">Select State</option>
												<?php
												foreach ($states as $key => $value) {
													?>
													<option value="<?php echo $value['state_id'];?>"><?php echo $value['state_name'];?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">User City</label>
										<select class="form-control" name="input_user_city" id="input_user_city">
										</select>
									</div>
								</div>
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">User Pincode</label>
										<input type="text" class="form-control" placeholder="Enter user pincode" name="input_user_pincode" id="input_user_pincode" value="">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">User Address</label>
										<textarea class="form-control" rows="2" name="input_user_address" id="input_user_address"></textarea>
									</div>
								</div>
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">User DOJ</label>
										<input type="text" class="form-control" placeholder="Enter user DOJ" name="input_user_doj" id="input_user_doj" value="">
									</div>
								</div>								
							</div>
							<div class="row">
								<div class="col-sm-12">
									<h6>User Upload Quota</h6>
									<hr>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-4">
									<div class="form-group">
										<label class="control-label">Upload Quota/day [University & College]</label>
										<input type="text" class="form-control" placeholder="Enter user upload quota" name="input_data_quota_per_day" id="input_data_quota_per_day" value="">
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label class="control-label">Upload Quota/month [University & College]</label>
										<input type="text" class="form-control" placeholder="Enter user upload quota" name="input_data_quota" id="input_data_quota" value="">
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label class="control-label">Amount/upload [University & College]</label>
										<input type="text" class="form-control" placeholder="Enter amount" name="input_data_quota_amount" id="input_data_quota_amount" value="">
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label class="control-label">Amount/upload [Exam & Stream]</label>
										<input type="text" class="form-control" placeholder="Enter amount" name="input_exam_data_quota_amount" id="input_exam_data_quota_amount" value="">
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label class="control-label">Amount Per Review</label>
										<input type="text" class="form-control" placeholder="Enter amount" name="input_review_amount" id="input_review_amount" value="">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<h6>User Permissions</h6>
									<select class="form-control" name="input_user_permission_type" id="input_user_permission_type">
										<!-- <option value="1">User Group Permission</option> -->
										<option  value="2">Individual Permission</option>
									</select>
									<hr>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<input type="checkbox" value="can_upload_colleges" name="input_user_permissions[]"> Upload College Data
									<input type="checkbox" value="can_upload_universities" name="input_user_permissions[]"> Upload University Data
									<input type="checkbox" value="can_upload_schools" name="input_user_permissions[]"> Upload School Data
									<input type="checkbox" value="can_delete_colleges" name="input_user_permissions[]"> Delete College Data
									<input type="checkbox" value="can_delete_universities" name="input_user_permissions[]"> Delete University Data
									<input type="checkbox" value="can_access_exams_data" name="input_user_permissions[]"> Upload Exam Data
									<input type="checkbox" value="can_access_streams_data" name="input_user_permissions[]" > Upload Stream Data 
								</div>
							</div>
		            	
		            </div>
		            <div class="modal-footer">
		            	<div class="row">
		            		<div class="col-sm-3">
								<button type="submit" class="btn btn-primary" id="btn_save_system_user">Save</button>
							</div>
		            	</div>
		            </div>
	            </form>
	        </div>
	    </div>
	</div>


<script type="text/javascript">let _user_type='2';</script>