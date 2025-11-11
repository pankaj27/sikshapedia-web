ac<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Back to Streams List</a></li>
			<li class="breadcrumb-item active" aria-current="page">Sub Stream List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Sub Stream of <?php echo $stream_data->stream_name;?></h6>
					<form id="form_sub_stream">
						<input type="hidden" name="_stream" value='<?php echo $stream_data->stream_id;?>'>
						<div class="row">
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Sub Stream Name</label>
									<input type="text" class="form-control" placeholder="Enter stream name" name="stream_name" id="stream_name">
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Serial No. (To order the course name)</label>
									<input type="text" class="form-control" placeholder="Serial No" name="stream_serial" id="stream_serial">
								</div>
							</div>

							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="stream_status">
										<option value="1">Active</option>
										<option value="2">Deactive</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-3">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_sub_stream">Save</button>
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
					<h6 class="card-title">Streams</h6>
					<div class="table-responsive">
						<table id="sub_streams_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Stream</th>		                        
		                        <th>Serial</th>
		                        <th>Colleges</th>
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


<script type="text/javascript"> let _parent_stream='<?php echo $parent_stream;?>';var course_parent='';var p_row='';var course_id ='';var stream ='';var degree='';var hdr='';var parent_folder='';</script>