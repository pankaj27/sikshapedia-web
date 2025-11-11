<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Colleges List</li>
		</ol>
	</nav>


	<?php
	if(!empty($quota)){
		?>
		<div class="row">
			<div class="col-12 col-xl-12 stretch-card">
				<div class="row flex-grow alert alert-danger">
					<strong>Note:If the per day quota is not fullfilled then the amount will not be calculated for that day.</strong>
				</div>
			</div>
		</div>
		<div class="row">
	        <div class="col-12 col-xl-12 stretch-card">
	            <div class="row flex-grow">
	            	<div class="col-md-3 grid-margin stretch-card">
		                <div class="card">
		                  	<div class="card-body">
			                    <div class="d-flex justify-content-between align-items-baseline">
			                      <h6 class="card-title mb-0">Upload Quota(month)</h6>
			                    </div>
			                    <div class="row">
			                      <div class="col-md-12">
			                        <h3 class="mb-2"><?php echo $quota['quota_to_upload_permonth'];?></h3>
			                        <div class="d-flex align-items-baseline">
			                          <p class="text-success">
			                            <span><?php echo $quota['month'];?>-<?php echo $quota['year'];?></span>
			                          </p>
			                        </div>
			                      </div>
			                    </div>
		                  	</div>
		                </div>
		            </div>
		            <div class="col-md-3 grid-margin stretch-card">
		                <div class="card">
		                  	<div class="card-body">
			                    <div class="d-flex justify-content-between align-items-baseline">
			                      <h6 class="card-title mb-0">Upload Quota(Day)</h6>
			                    </div>
			                    <div class="row">
			                      <div class="col-md-12">
			                        <h3 class="mb-2"><?php echo $quota['quota_to_upload_perday'];?></h3>
			                        <div class="d-flex align-items-baseline">
			                          <p class="text-success">
			                            <span>Quota must be completed</span>
			                          </p>
			                        </div>
			                      </div>
			                    </div>
		                  	</div>
		                </div>
		            </div>
	              <div class="col-md-3 grid-margin stretch-card">
	                <div class="card">
	                  <div class="card-body">
	                    <div class="d-flex justify-content-between align-items-baseline">
	                      <h6 class="card-title mb-0">Total Upload</h6>
	                    </div>
	                    <div class="row">
	                      <div class="col-md-12">
	                        <h3 class="mb-2"><?php echo $quota['completed'];?></h3>
	                        <div class="d-flex align-items-baseline">
	                          <p class="text-success">
	                            <span><?php echo $quota['month'];?>-<?php echo $quota['year'];?></span>
	                          </p>
	                        </div>
	                      </div>
	                    </div>
	                  </div>
	                </div>
	              </div>
	              <div class="col-md-3 grid-margin stretch-card">
	                <div class="card">
	                  <div class="card-body">
	                    <div class="d-flex justify-content-between align-items-baseline">
	                      <h6 class="card-title mb-0">Admin Approved</h6>
	                    </div>
	                    <div class="row">
	                      <div class="col-md-12">
	                        <h3 class="mb-2"><?php echo $quota['approved'];?></h3>
	                        <div class="d-flex align-items-baseline">
	                          <p class="text-success">
	                            <span><?php echo $quota['month'];?>-<?php echo $quota['year'];?></span>
	                          </p>
	                        </div>
	                      </div>
	                    </div>
	                  </div>
	                </div>
	              </div>
	              <div class="col-md-3 grid-margin stretch-card">
	                <div class="card">
	                  <div class="card-body">
	                    <div class="d-flex justify-content-between align-items-baseline">
	                      <h6 class="card-title mb-0">Admin Not Approved</h6>
	                    </div>
	                    <div class="row">
	                      <div class=" col-md-12">
	                        <h3 class="mb-2"><?php echo $quota['not_approved'];?></h3>
	                        <div class="d-flex align-items-baseline">
	                          <p class="text-danger">
	                            <span><?php echo $quota['month'];?>-<?php echo $quota['year'];?></span>
	                          </p>
	                        </div>
	                      </div>
	                    </div>
	                  </div>
	                </div>
	              </div>
	              <div class="col-md-3 grid-margin stretch-card">
	                <div class="card">
	                  <div class="card-body">
	                    <div class="d-flex justify-content-between align-items-baseline">
	                      <h6 class="card-title mb-0">Earning</h6>
	                    </div>
	                    <div class="row">
	                      <div class="col-md-12">
	                        <h3 class="mb-2">₹<?php echo $quota['total_earned'];?></h3>
	                        <div class="d-flex align-items-baseline">
	                          <p class="text-success">
	                            <span><?php echo $quota['month'];?>-<?php echo $quota['year'];?></span>
	                          </p>
	                        </div>
	                      </div>
	                    </div>
	                  </div>
	                </div>
	              </div>
	            </div>
	        </div>
	    </div>
		<?php
	}
	?>

		<?php
		if($userdata->user_role=='5'){
			?>
			<div class="row">
				<div class="col-md-12 grid-margin stretch-card">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title">Sample College for Reference (Do not change anything in it)</h6>
							<div class="col-md-12">
								<div class="table-responsive">
									<table id="" class="table">
										<thead>
					                      <tr>
					                        <th>#</th>
					                        <th>Name</th>
					                        <th>Action</th>
					                      </tr>
					                    </thead>
					                    <tbody>
					                    <?php
					                    if(!empty($sample_colleges)){
					                    	$i=1;
					                    	foreach ($sample_colleges as $key => $value) {
					                    		?>
					                    		<tr>
					                    			<td><?php echo $i;?></td>
					                    			<td><?php echo $value['college_name'];?></td>
					                    			<td><a href="<?php echo $value['college_edit_link'];?>" class="btn btn-sm btn-primary">View</a></td>
					                    		</tr>
					                    		<?php
					                    		$i++;
					                    	}
					                    }
					                    ?>	                    	
					                    </tbody>
									</table>
								</div>
							</div>	
						</div>
					</div>
				</div>
			</div>
			<?php
		}
		?>
		<div class="row">
			<div class="col-md-12 grid-margin stretch-card">
				<div class="card">
					<div class="card-body">
						<h6 class="card-title">Colleges <a href="<?php echo $admin_base_url;?>/institutions/colleges/add" class="btn btn-sm btn-primary pull-right">Add</a> 
							<?php
							if($userdata->user_role!='5'){
								?>
								<button class="btn btn-primary" data-toggle="modal" data-target="#collegeImportModal">Import</button>
								<?php
							}

							?>
						 </h6>
						<div class="col-md-12">
							<div class="table-responsive">
								<!-- <div>
							        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
							    </div> -->
								<table id="college_list_table" class="table">
									<thead>
				                      <tr>
				                        <th>#</th>
				                        <th>Name</th>
				                       <!--  <th>Country</th>
				                        <th>State</th>
				                        <th>City</th> -->
				                        <!-- <th>Estd. Year</th> -->
				                        <th>Status</th>
				                        <!-- <th>Slug</th> -->
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

<div class="modal fade bd-example-modal-xl" id="collegeImportModal" tabindex="-1" role="dialog" aria-labelledby="collegeImportModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="collegeImportModal">Import Colleges</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="<?php echo ($userdata->user_role=='5')?'form_college_excel_2':'form_college_excel';?>">
	            <div class="modal-body">	            	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<?php
	            		if($userdata->user_role=='5'){
	            			?>
	            			<div class="form-group">
		            			<div class="alert alert-info">
		            				<p>
		            					<ul>
		            						<li>1.Download sample excel file</li>
		            						<li>2.Choose a state in India</li>
		            						<li>3.Choose an University from the University list in the side menu.University must be from the list.</li>
		            						<li>4.Fill up the excel file & save to a folder of your choice in your computer.</li>
		            						<li>5.Now browse that excel file you have saved</li>
		            						<li>6.Click on Upload & the data will be uploaded & populated i the list</li>
		            						<li>7.Once all the data uploaded then you will be able to fill up other important data of the colleges by editing the college< data./li>
		            						<li><b>Note 1:</b>If there is any duplicate data or blank data then the data will not be uploaded properly.In excel file rows should not exceeds upto 50 rows.Download the sample file for reference.</li>
		            						<li><b>Note 2:</b>After importing data you need to complete the all the required data of the colleges like college logo,college banner,college course related data.Data you can grab from Google or <b>https://collegedunia.com/</b>.Just paste and search the name of the college.</li>
		            						<li><b>Note 3:</b>Do not close or click any where in the form while uploading data.</li>
		            					</ul>
		            				</p>
		            			</div>
		            		</div>
		            		<div class="form-group">
	            				<label>State</label>
	            				<select class="form-control" name="country_states" id="country_states">
	            					<option value="0">Select State</option>
	            					<?php
	            					if(!empty($country_states)){
	            						foreach ($country_states as $key => $value) {
	            							?>
	            							<option value="<?php echo encode_data($value->state_id);?>"><?php echo $value->state_name;?></option>
	            							<?php
	            						}
	            					}
	            					?>
	            				</select>
		            		</div>
		            		<div class="form-group">
	            				<label>University</label>
	            				<select class="form-control" name="country_universities" id="college_university">
	            					<option value="0">Select University</option>            					
	            				</select>
		            		</div>
	            			<?php
	            		}
	            		?>
			            		
	            		<div class="form-group">
							<label>Select File (Only .xlsx file allowed)</label>
							<input type="file" name="college_excel" class="file-upload-default">
							<div class="input-group col-xs-12">
								<input type="text" class="form-control file-upload-info" disabled="" placeholder="Excel File">
								<span class="input-group-append">									
									<button class="file-upload-browse btn btn-primary" type="button">Browse</button>
								</span>
							</div>
						</div>
	            	
	            </div>
	            <div class="modal-footer">
	            	<?php
	            	if($userdata->user_role=='5'){
	            		?>
	            		<a href="https://waytoadmissions.com/uploads/app/samples/sample_file.xlsx" class="btn btn-success" download>Download Sample File</a>
	            		<?php
	            	}


	            	if($userdata->user_role=='5'){
	            		?>
	            		<button type="submit" class="btn btn-primary" id="btn_import_college_data_preview">Preview</button>
	            		<button type="submit" class="btn btn-primary" id="btn_import_college" style="display: none;">Upload</button>
	            		<?php
	            	}else{
	            		?>
	            		<button type="submit" class="btn btn-primary" id="btn_import_college">Upload</button>
	            		<?php
	            	}
	            	?>
	            	
	                
	            </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade bd-example-modal-xl" id="collegeImportPreviewModal" tabindex="-1" role="dialog" aria-labelledby="collegeImportPreviewModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="collegeImportModal">Import Preview</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body"></div>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl" id="collegeQuickUpdateModal" tabindex="-1" role="dialog" aria-labelledby="collegeQuickUpdateModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="collegeQuickUpdateModalTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_college_quick_upload">
	            <div class="modal-body">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<input type="hidden" name="_college_id" id="_college_id" value="">
		            		
            		<div class="row">
		            	<div class="col-md-12">
		            		<div class="form-group">
								<label>College Name</label>
								<input type="text" class="form-control" placeholder="College Name" name="college_name" id="college_name">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
		            		<div class="form-group">
								<label>College Email</label>
								<input type="text" class="form-control" placeholder="Enter official email" name="college_email" id="college_email">
							</div>
						</div>
						<div class="col-md-3">
		            		<div class="form-group">
								<label>College Phone No.</label>
								<input type="text" class="form-control" placeholder="Enter official phone no." name="college_phone" id="college_phone">
							</div>
						</div>
						<div class="col-md-3">
		            		<div class="form-group">
								<label>College Estd. Year</label>
								<input type="text" class="form-control" placeholder="Enter Estd. Year" name="college_estd" id="college_estd">
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group">
								<label class="control-label">Pincode</label>
								<input type="text" class="form-control" placeholder="College pincode" name="college_pincode" value="">
							</div>
						</div>
					</div>
					<div class="row">							
						<div class="col-md-12">
							<div class="form-group">
								<label class="control-label">Address</label>
								<textarea class="form-control" rows="3" placeholder="College Address" name="college_address"></textarea>
							</div>
						</div>							
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>College Logo</label>
								<input type="file" name="college_logo" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
									</span>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>College Banner</label>
								<input type="file" name="college_banner" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Banner" value="">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Banner</button>
									</span>
								</div>
							</div>
						</div>
					</div>
	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_college_quick">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl" id="courseModal" tabindex="-1" role="dialog" aria-labelledby="courseModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="courseModal">Courses Offered</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_college_courses">
            	<input type="hidden" name="college" id="college" value="">
            	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            <div class="modal-body">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<div class="row">
            			<div class="col-md-12">
	            			<input type="text" class="form-control" id="search_param_course" placeholder="Search courses" style="border-color: #000000;">
	            		</div>
            		</div>
            		<div class="row" style="padding-top: 20px;"></div>
            		<div class="row" id="courses_offered_row">
						
					</div>	            	
	            </div>
	            <div class="modal-footer">
	                <button type="submit" class="btn btn-primary" id="btn_add_courses_to_college" disabled="">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl" id="categoriesModal" tabindex="-1" role="dialog" aria-labelledby="categoriesModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Categories</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_college_categories">
            	<input type="hidden" name="college" id="college" value="">
            	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            <div class="modal-body">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<div class="row">
						
					</div>	            	
	            </div>
	            <div class="modal-footer">
	                <button type="submit" class="btn btn-primary" id="btn_add_categories_to_college" disabled="">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl" id="featuredCollegeModal" tabindex="-1" role="dialog" aria-labelledby="featuredCollegeModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_college_courses">
            	<input type="hidden" name="college" id="college" value="">
            	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            <div class="modal-body">	            	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<div class="form-group">
							
						</div>
	            	
	            </div>
	            <div class="modal-footer">
	                <button type="submit" class="btn btn-primary" id="btn_add_courses_to_college" disabled="">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>

<script type="text/javascript">let _college='';let country='<?php echo encode_data('99');?>';let colleg_faq_row='';</script>