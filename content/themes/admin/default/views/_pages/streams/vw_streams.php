ac<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Stream List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Stream</h6>
					<form id="form_stream">
						<input type="hidden" name="_stream" value=''>
						<div class="row">
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Stream Name</label>
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
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_stream">Save</button>
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
						<table id="streams_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Stream</th>		                        
		                        <th>Serial</th>
		                        <th>Colleges</th>
		                        <th>Sub Streams</th>
		                        <th>Degrees</th>
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


<div class="modal fade bd-example-modal-xl" id="streamMoveModal" tabindex="-1" role="dialog" aria-labelledby="streamMoveModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="streamMoveModalTitle">Browse Streams</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_move_stream_data">
            	<input type="hidden" name="move_to_stream_id" id="move_to_stream_id">
	            <div class="modal-body">
	            	<div class="row">
		            	<div class="col-md-12">
		            		<div class="form-group">
		            			<input type="text" id="move_to_stream_name" name="move_to_stream_name" value="" class="form-control">
							</div>
						</div>
					</div>	            		
            		<div class="row">
		            	<div class="col-md-12">
		            		<div class="form-group">
								<select class="form-control" name="move_to_parent_stream_id" id="move_to_parent_stream_id">
									<option value="0">Select Parent Stream</option>
									<?php
									if(!empty($streams)){
										foreach ($streams as $key => $value) {
											?>
											<option value="<?php echo $value->stream_id;?>"><?php echo $value->stream_name;?></option>
											<?php
										}
									}

									?>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<button class="btn btn-sm btn-primary" id="btn_move_to_sub_stream">Move to Sub-stream</button>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="table-responsive">
								<table id="found_college_list_table" class="table">
				                    <tbody>		                    	
				                    </tbody>
								</table>
							</div>
						</div>
					</div>	            	
	            </div>
            </form>
        </div>
    </div>
</div>



<div class="modal fade bd-example-modal-xl" id="editStreamCollegeModal" tabindex="-1" role="dialog" aria-labelledby="editStreamCollegeModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editStreamCollegeModalTitle">Add/Remove Stream Colleges</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_stream_college_edit">
	            <div class="modal-body">	            	
	            		
	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_stream_colleges">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>


<script type="text/javascript"> let _parent_stream='';</script>
<script type="text/javascript">var course_parent='';let stream='';let degree='';let course_id='';let hdr='';let parent_folder='';</script>