ac<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Courses List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-4 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Course - [<?php echo $course_data->course_name;?>]</h6>
					<form id="form_course">
						<input type="hidden" name="_course" id="_course" value="">
						<input type="hidden" name="_parent_course" id="_parent_course" value='<?php echo (isset($course_id))?$course_id:'';?>'>
						<input type="hidden" class="form-control" name="course_streams" id="course_streams" value="<?php echo encode_data($course_data->course_stream);?>">
						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">Course Name</label>
									<input type="text" class="form-control" placeholder="Enter course name" name="course_name" id="course_name" value="">
								</div>
							</div>
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">Course Short Name</label>
									<input type="text" class="form-control" placeholder="Enter course name" name="course_short_name" id="course_short_name" value="">
								</div>
							</div>
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">Course Type</label>
									<select class="form-control" name="course_type" id="course_type">
										<option value="normal" <?php echo (isset($course_data) && $course_data->course_is_honors==1)?'selected':'' ;?>>Normal</option>
										<option value="honours" <?php echo (isset($course_data) && $course_data->course_is_honors==1)?'selected':'' ;?>>Honours</option>
										<option value="lateral" <?php echo (isset($course_data) && $course_data->course_is_lateral==1)?'selected':'' ;?>>Lateral</option>
									</select>
								</div>
							</div>
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="course_status">
										<option value="1" <?php echo (isset($course_data) && $course_data->course_status==1)?'selected':'' ;?>>Active</option>
										<option value="2" <?php echo (isset($course_data) && $course_data->course_status==2)?'selected':'' ;?>>Deactive</option>
									</select>
								</div>
							</div>						
							<div class="col-sm-3">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_course">Save</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>

		<div class="col-md-8 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Courses</h6>
					<div class="table-responsive">
						<table id="courses_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Course</th>
		                        <th>Stream</th>
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

<script type="text/javascript">var course_parent='<?php echo $course_id;?>';</script>