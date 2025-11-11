<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Exam's List</li>
		</ol>
	</nav>

	<?php
	if($total_logos_missing>0){
		?>
		<div class="row">
			<div class="col-md-12 grid-margin stretch-card alert-danger">
				<h6>Total Logo Missing:<?php echo $total_logos_missing;?></h6>
			</div>
		</div>
		<?php
	}
	?>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">
						Exams	<button type="button" id="btn_add_exam_modal" class="btn btn-primary" data-target="#examsModal" data-toggle="modal" style="float:right;">Add</button>
					</h6>
					<div class="table-responsive">
						<table id="exam_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Exam Name</th>
		                        <!-- <th>Enlist as Top Exam</th>
		                        <th>Enlisted as Popular Exam</th> -->
		                        <th>Data Upload By</th>
		                        <th>Status</th>
		                        <!-- <th>Action</th> -->
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


<div class="modal fade bd-example-modal-xl" id="examsModal" tabindex="-1" role="dialog" aria-labelledby="examsModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="examsModal">Add Exam</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_exam">
	            <div class="modal-body">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<input type="hidden" name="_exam" value="" id="_exam">

            		<div class="row">
            			<div class="col-md-4">
            				<div class="form-group">
            					<label>Country</label>
            					<select class="form-control" name="exam_country" id="exam_country">
            						<?php
            						foreach ($countrues as $key => $value) {
            							?>
            							<option value="<?php echo $value['country_id'];?>"><?php echo $value['country_name'];?></option>
            							<?php
            						}
            						?>
            					</select>
            				</div>
            			</div>
            			<div class="col-md-4">
            				<div class="form-group">
            					<label>Exam Type</label>
            					<select class="form-control" name="exam_type" id="exam_type">
            						<option value="1">Central</option>
            						<option value="2">State</option>
            						<option value="3">International</option>
            					</select>
            				</div>
            			</div>
            			<div class="col-md-4" id="exam_state_div" style="display: none;">
            				<div class="form-group">
            					<label>State</label>
            					<select class="form-control" name="exam_state" id="exam_state">
            						
            					</select>
            				</div>
            			</div>
            		</div>
            		
		            <div class="row">
		            	<div class="col-md-6">
		            		<div class="form-group">
								<label>Exam Name</label>
								<input type="text" class="form-control" placeholder="Exam Name" name="exam_name" id="exam_name">
							</div>
						</div>
						<div class="col-md-6">
		            		<div class="form-group">
								<label>Exam Short Name</label>
								<input type="text" class="form-control" placeholder="Exam Short Name" name="exam_short_name" id="exam_short_name">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
								<label>Exam Description</label>
								<textarea type="text" class="form-control" placeholder="Exam Description" name="exam_description" id="exam_description" rows="3"></textarea>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">	
							<div class="form-group">
								<label>Select File (Only .jpg file allowed)</label>
								<input type="file" name="exam_logo" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo">
									<span class="input-group-append">									
										<button class="file-upload-browse btn btn-primary" type="button">Browse</button>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
            			<div class="col-md-12">
		            		<div class="form-group">
		            			<h6>Select Stream</h6>
		            			<hr>
		            			<div id="streams_div">
		            				
		            			</div>
		            		</div>
		            	</div>
		            </div>           	
	            </div>
	            <div class="modal-footer">
	                <button type="submit" class="btn btn-primary" id="btn_add_exam">Save</button>
	            </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade bd-example-modal-xl" id="examsdatesModal" tabindex="-1" role="dialog" aria-labelledby="examsdatesModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="examsdatesModal">Add/Upodate Exam Dates</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            
	            <div class="modal-body">
	            	<form id="form_exam_dates">           	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<input type="hidden" name="_exam" value="" id="_exam">

	            		<div class="row">
	            			<div class="col-md-4">
	            				<div class="form-group">
	            					<label>Year</label>
	            					<select class="form-control" name="exam_year" id="exam_year">
	            						<?php
	            						$prev_year=(date('Y')-1);

	            						for ($i=$prev_year; $i <=(date('Y')+1) ; $i++) { 
	            							?>
	            							<option value="<?php echo $i;?>"><?php echo $i;?></option>
	            							<?php
	            						}
	            						?>
	            					</select>
	            				</div>
	            			</div>
	            			<div class="col-md-4">
	            				<div class="form-group">
	            					<label>Application Start Date</label>
	            					<input type="text" name="exam_application_start_date" id="exam_application_start_date" placeholder="Application Start Date" class="form-control" readonly>
	            				</div>
	            			</div>
	            			<div class="col-md-4" id="exam_state_div">
	            				<div class="form-group">
	            					<label>Application End Date</label>
	            					<input type="text" name="exam_application_end_date" id="exam_application_end_date" placeholder="Application End date" class="form-control" readonly>
	            				</div>
	            			</div>
	            		</div>
	            		
			            <div class="row">
			            	<div class="col-md-3">
			            		<div class="form-group">
									<label>Exam Start Date</label>
									<input type="text" class="form-control" placeholder="Exam Start Date" name="exam_start_date" id="exam_start_date" readonly>
								</div>
							</div>
							<div class="col-md-3">
			            		<div class="form-group">
									<label>Exam End Date</label>
									<input type="text" class="form-control" placeholder="Exam End Date" name="exam_end_date" id="exam_end_date" readonly>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Exam Result Start Date</label>
									<input type="text" class="form-control" placeholder="Exam Result Start Date" name="exam_result_start_date" id="exam_result_start_date" readonly>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Exam Result End Date</label>
									<input type="text" class="form-control" placeholder="Exam Result End date" name="exam_result_end_date" id="exam_result_end_date" readonly>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="form-group">
									<label>Description</label>
									<textarea class="form-control" name="exam_short_desc" id="exam_short_desc"></textarea>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6">
								<div class="form-group">
									<label>Status</label>
									<select class="form-control" name="exam_date_status">
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
									</select>
								</div>
							</div>
							<div class="col-md-6">
								<div class="form-group">
									<button type="submit" class="btn btn-primary" id="btn_add_exam_dates" style="margin-top:30px;">Save</button>
								</div>
							</div>
						</div>
					</form>   	
	            </div>
	            <div class="modal-footer">
	            	<div class="row table-responsive">
	            		<table class="table" id="exams_dates_table">
	            			<thead>
	            				<th>Year</th>
	            				<th>Application Start</th>
	            				<th>Application End</th>
	            				<th>Exam Start</th>
	            				<th>Exam End</th>
	            				<th>Exam Result Start</th>
	            				<th>Exam Result End</th>
	            				<th>Status</th>
	            				<th>Upcomming</th>
	            			</thead>
	            			<tbody></tbody>
	            		</table>
	            	</div>
	            </div>
            </form>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl" id="examPreparatioGuideModal" tabindex="-1" role="dialog" aria-labelledby="examPreparatioGuideModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="examPreparatioGuideModalTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            
	            <div class="modal-body">
	            	<form id="form_up_exam_preparation_guide" enctype="multipart/form-data">
	            		<input type="hidden" name="_prep_exam_id" id="_prep_exam_id" value="">
	            		<input type="hidden" name="_prep_id" id="_prep_id" value="">
	            		
	                    <div class="row">
	                    	<div class="col-md-12">
	            				<div class="form-group">
	            					<label>Title</label>
	            					<input type="text" name="prep_guide_title" class="form-control" id="prep_guide_title">
	            				</div>
	            			</div>
	                    </div>
	                    <div class="row">
	                    	<div class="col-md-12">
	            				<div class="form-group">
	            					<label>Page Heading</label>
	            					<input type="text" name="prep_guide_page_heading" class="form-control" id="prep_guide_page_heading">
	            				</div>
	            			</div>
	                    </div>
	                    <div class="row">
	                    	<div class="col-md-12">
	            				<div class="form-group">
	            					<label>Short Description</label>
	            					<textarea name="prep_guide_short_desc" class="form-control" id="prep_guide_short_desc" rows="5"></textarea>
	            				</div>
	            			</div>
	                    </div>
	                    <div class="row">
	                    	<div class="col-md-12">
	                    		<div class="col-md-12">
	                    			<button type="submit" class="btn btn-primary" id="upload_prep_guide_data">Upload</button>
	                    		</div>
	                    	</div>
	                    </div>
	            	</form>
	            </div>
	            <div class="modal-footer">
	                <div class="table-responsive" style="width:100%;">
						<table id="preparation_guide_list_table" class="table" style="width: 100%;">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Title</th>
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

<script type="text/javascript">var degree='';var stream=''; var _parent_stream='';let course_parent='';let course_id='';let hdr='';let parent_folder='';var p_row ='';</script>