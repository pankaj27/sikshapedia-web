<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Exam's List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">
						<?php
						if(isset($degree_data)){
							?>
							Degree - [ <?php echo $degree_data->degree_name;?> ]
							<?php
						}
						?>						
					</h6>
					<form id="form_exam">
						<input type="hidden" name="_exam" value="">
						<?php
						if(isset($degree_data)){
							?>
							<input type="hidden" name="_degree" value="<?php echo encode_data($degree_data->degree_id);?>">
							<?php
						}
						?>
						
						<div class="row">
							<?php
							if (isset($system_degrees)) {
								?>
								<div class="col-sm-4">
									<div class="form-group">
										<label class="control-label">Degree</label>
										<select class="form-control" name="_degree" id="_degree">
											<option value="">Select Degree</option>
											<?php
											if(!empty($system_degrees)){
												foreach ($system_degrees as $key => $value) {
													?>
													<option value="<?php echo encode_data($value->degree_id);?>"><?php echo $value->degree_name;?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
								</div>
								<?php
							}
							?>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Exam Name</label>
									<input type="text" class="form-control" placeholder="Enter Exam name" name="exam_name">
								</div>
							</div>

							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="exam_status">
										<option value="1">Active</option>
										<option value="2">Deactive</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-3">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_exam">Save</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">
						<?php
						if(isset($degree_data)){
							?>
							Exams - [ <?php echo $degree_data->degree_name;?> ]
							<?php
						}else{
							?>
							Exams
							<?php
						}
						?>
					</h6>
					<div class="table-responsive">
						<table id="exam_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Degree</th>
		                        <th>Exam</th>
		                        <th>Status</th>
		                        <th>Action</th>
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
<script type="text/javascript">var degree='<?php echo (isset($degree_data))?encode_data($degree_data->degree_id):'';?>';var stream='';</script>