<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Courses List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Course</h6>
					<div class="row">
						<div class="col-sm-12">
							<div class="form-group">
								<label class="control-label">Parent Course</label>
								<select class="form-control" name="_parent_course" id="parent_course">
									<option value="0">Select Course</option>
									<?php
									if(!empty($parent_courses)){
										foreach ($parent_courses as $key => $value) {
											?>
											<option value="<?php echo encode_data($value->course_id);?>"><?php echo $value->course_name;?></option>
											<?php
										}
									}
									?>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="table-responsive">
						<table id="courses_details_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Course</th>
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
</div>