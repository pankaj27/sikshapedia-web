<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Degree's List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">
						<?php
						if(isset($stream_data)){
							?>
							Stream - [ <?php echo $stream_data->stream_name;?> ]
							<?php
						}
						?>
						</h6>
					<form id="form_degree">
						<input type="hidden" name="_degree" value="">
						<?php
						if(isset($stream_data)){
							?>
							<input type="hidden" name="_stream" value="<?php echo encode_data($stream_data->stream_id);?>">
							<?php
						}
						?>
						
						<div class="row">
							<?php
							if (isset($system_streams)) {
								?>
								<div class="col-sm-4">
									<div class="form-group">
										<label class="control-label">Stream</label>
										<select class="form-control" name="_stream" id="_stream">
											<option value="">Select Stream</option>
											<?php
											if(!empty($system_streams)){
												foreach ($system_streams as $key => $value) {
													?>
													<option value="<?php echo encode_data($value->stream_id);?>"><?php echo $value->stream_name;?></option>
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
									<label class="control-label">Degree Name</label>
									<input type="text" class="form-control" placeholder="Enter Degree name" name="degree_name">
								</div>
							</div>

							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="degree_status">
										<option value="1">Active</option>
										<option value="2">Deactive</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-3">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_degree">Save</button>
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
						if(isset($stream_data)){
							?>
							Degrees - [ <?php echo $stream_data->stream_name;?> ]
							<?php
						}else{
							?>
							Degrees
							<?php
						}
						?>
					</h6>
					<div class="table-responsive">
						<table id="degree_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Stream</th>
		                        <th>Degree</th>
		                        <th>Exams</th>
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
<script type="text/javascript">var stream='<?php echo (isset($stream_data))?encode_data($stream_data->stream_id):'';?>';var degree='';</script>