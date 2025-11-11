<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Search Lists</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Select Search Types</h6>
					<div class="col-md-12">
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page Country</label>
									<select class="form-control" id="page_country" name="page_country">
										<option value="0">Select Country</option>
										<option value="<?php echo encode_data('99');?>" selected>India</option>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page State</label>
									<select class="form-control" id="page_state" name="page_state">
										<option value="0">Select State</option>
										<?php
										foreach ($states as $key => $value) {
											?>
											<option value="<?php echo $value['state_id'];?>"><?php echo $value['state_name'];?></option>
											<?php
										}
										?>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page City</label>
									<select class="form-control" id="page_city">
										<option value="0">Select City</option>
										
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page Type</label>
									<select class="form-control" id="page_type" name="page_type">
										<option value="universities">University</option>
										<option value="colleges">College</option>
										<option value="schools">School</option>
										<option value="exams">Exam</option>
										<option value="courses">Course</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page Streams</label>
									<select class="form-control" id="page_stream" name="page_stream">
										<option value="0">Select Streams</option>
										<?php
										foreach ($streams as $key => $value) {
											?>
											<option value="<?php echo $value['stream_id'];?>"><?php echo $value['stream_name'];?></option>
											<?php
										}
										?>
									</select>
								</div>
							</div>

							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page Courses</label>
									<select class="form-control" id="page_course" name="page_course">
										<option value="0">Select Course</option>
										
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<button class="btn btn-sm btn-primary" type="button" style="margin-top: 33px;" id="view_slug">View</button>
									<button class="btn btn-sm btn-dark" type="button" style="margin-top: 33px;" id="generate_slug">Generate</button>
								</div>
							</div>
						</div>

						<div class="row"><hr></div>

						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Institute category Type</label>
									<select class="form-control" id="inst_category" name="inst_category">
										<option value="0">Select</option>
										<?php
										if(!empty($institute_categories)){
											foreach ($institute_categories as $key => $value) {
												?>
												<option value="<?php echo $value['url_slug'];?>"><?php echo $value['inst_category_short_name'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Ranking Agency</label>
									<select class="form-control" id="ranking_agency" name="ranking_agency">
										<option value="0">Select</option>
										<?php
										if(!empty($agencies)){
											foreach ($agencies as $key => $value) {
												?>
												<option value="<?php echo $value['url_slug'];?>"><?php echo $value['agency_short_name'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Institute Type</label>
									<select class="form-control" id="inst_type" name="inst_type">
										<option value="0">Select</option>
										<?php
										if(!empty($institute_types)){
											foreach ($institute_types as $key => $value) {
												?>
												<option value="<?php echo $value['url_slug'];?>"><?php echo $value['inst_type_short_name'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Affiliation Type</label>
									<select class="form-control" id="affiliation_type" name="affiliation_type">
										<option value="0">Select</option>
										<?php
										if(!empty($affiliation_types)){
											foreach ($affiliation_types as $key => $value) {
												?>
												<option value="<?php echo $value['url_slug'];?>"><?php echo $value['statutory_body_abbr'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<button class="btn btn-sm btn-dark" type="button" style="margin-top: 33px;" id="generate_slug_other_types">Generate</button>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-md-12" id="stat_msg"></div>
							<div class="table-responsive">
								<!-- <div>
							        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
							    </div> -->
								<table id="slug_list_table" class="table">
									<thead>
				                      <tr>
				                        <th>#</th>
				                        <th>Search URL</th>				                        
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
</div>

<script type="text/javascript">var _user_type='';var user_id='<?php echo encode_data($internal_userdata->user_id);?>';var p_row='';</script>