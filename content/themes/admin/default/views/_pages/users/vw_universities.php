<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Universities List</li>
		</ol>
	</nav>

	<?php
	if(!empty($quota)){
		?>
		<!-- <div class="row">
	        <div class="col-12 col-xl-12 stretch-card">
	            <div class="row flex-grow">
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
	                      <h6 class="card-title mb-0">Earning  [ <?php echo $quota['month'];?>-<?php echo $quota['year'];?> ]</h6>
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
	    </div> -->
		<?php
	}
	?>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Universities 
						<?php
						if($userdata->user_role!='5'){
							?>
							<a href="<?php echo $admin_base_url;?>/institutions/universities/add" class="btn btn-sm btn-primary pull-right">Add</a>

							<button class="btn btn-xs btn-primary" data-target="#collegeQuickAddModal" data-toggle="modal">Quick Add</button>
							<?php
						}

						?>
					</h6>
					<div class="table-responsive">
						<table id="university_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Name</th>
		                        <th>Status</th>
		                        <?php
		                        if($userdata->user_role=='1'){
		                        	?>
		                        	<!-- <th>Slug</th> -->
		                        	<?php
		                        }

		                        if($userdata->user_role!='5'){
		                        	?>
		                        	<th>Action</th>
		                        	<?php
		                        }
		                        ?>
		                        
		                        
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


<div class="modal fade bd-example-modal-xl" id="collegeQuickAddModal" tabindex="-1" role="dialog" aria-labelledby="collegeQuickAddModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="collegeQuickUpdateModalTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div id="quick_update_div">
	         
        	</div>
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
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="" id="college_logo_name">
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
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Banner" value="" id="college_banner_name">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Banner</button>
									</span>
								</div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col-md-3">
							<div class="form-group">
								<label>College is Featured</label>
								<select class="form-control" name="college_is_featured" id="college_is_featured">
									<option value="2">No</option>
									<option value="1">Yes</option>
								</select>
							</div>
						</div>

						<div class="col-md-3">
							<div class="form-group">
								<label>College Visible in Search Result Grid</label>
								<select class="form-control" name="college_is_visible_in_search" id="college_is_visible_in_search">
									<option value="1">Yes</option>
									<option value="2">No</option>									
								</select>
							</div>
						</div>

						<div class="col-md-3">
							<div class="form-group">
								<label>College Show in Home Page as Top College</label>
								<select class="form-control" name="college_is_top_college" id="college_is_top_college">
									<option value="2">No</option>
									<option value="1">Yes</option>
								</select>
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group">
								<label>Admin Verified</label>
								<select class="form-control" name="college_admin_verified" id="college_admin_verified">
									<option value="2">No</option>
									<option value="1">Yes</option>
								</select>
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


<style type="text/css">
	#specificFileBrowserModal{
		z-index: 99999;
	}
	#university_country_chosen{
		width:100% !important;
	}
	#university_state_chosen{
		width: 100% !important;
	}
	#university_city_chosen{
		width:100% !important;
	}
</style>

<script type="text/javascript">
	var p_row='';
	var colleg_faq_row='';
	var colleg_placement_faq_row='';
	var colleg_scholarship_faq_row='';
	var colleg_ranking_row='';
	var colleg_faq_row='';
	var _college='';
	var college_type='101';
	var parent_folder='<?php echo $parent_folder_data->media_disk_name;?>';


	$(document).ready(function(){
	 	$.validator.addMethod(
	        "maxFileSize",
	        function (value, element, params) {

	            var files,
	                unit = params.unit || "KB",
	                size = params.size || 100,
	                max_file_size = fileSizeToBytes(size, unit),
	                is_valid = false;

	            if (!is_supported_browser || this.optional(element)) {

	                is_valid = true;

	            } else {

	                files = element.files;

	                if (files.length < 1) {

	                    is_valid = false;

	                } else {

	                    is_valid = files[0].size <= max_file_size;

	                }
	            }

	            return is_valid;
	        },
	        function (params, element) {
	            return formatter(
	                "File cannot be larger than {0}{1}.",
	                [params.size || 100, params.unit || "KB"]
	            );
	        }
	  	);

	  	$.validator.addMethod(
	      "minFileSize",
	      function (value, element, params) {

	          var files,
	              unit = params.unit || "KB",
	              size = params.size || 100,
	              min_file_size = fileSizeToBytes(size, unit),
	              is_valid = false;

	          if (!is_supported_browser || this.optional(element)) {

	              is_valid = true;

	          } else {

	              files = element.files;

	              if (files.length < 1) {

	                  is_valid = false;

	              } else {

	                  is_valid = files[0].size >= min_file_size;

	              }
	          }

	          return is_valid;
	      },
	      function (params, element) {
	          return formatter(
	              "File must be at least {0}{1} large.",
	              [params.size || 100, params.unit || "KB"]
	          );
	      }
	  );


		
	});
</script>