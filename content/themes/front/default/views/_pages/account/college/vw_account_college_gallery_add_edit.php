<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="profile-content py-4">
	<div class="wrapper">
		<div class="row">
			<div class="col-lg-9 mb-4 mb-lg-0" id="gallery_tabs">
				<div class="card userCard">
					<div class="card-header bg-white">
		        	  <h5 class="m-0 d-inline">Gallery Files</h5>
		        	</div>
		        	<div class="card-body">

							<div class="table-responsive">
				                <table class="table display table-striped no-wrap" id="gallery_list_table">
				                    <thead>
				                    <tr>
				                    	<th>#</th>
				                        <th>File</th>
				                        <th>Category</th>
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
			<div class="col-lg-3 mb-4 mb-lg-0" id="gallery_tabs">
				<div class="card userCard">
					<div class="card-header bg-white">
		        	  <h5 class="m-0 d-inline">Gallery Settings</h5>
		        	</div>
		        	<div class="card-body">
		        		<form id="form_gallery_settings" enctype="multipart/form-data">
                  <input type="hidden" name="data_type" value="gallery_settings">
		        			<div class="row">
    				        <div class="form-group col-sm-12">
                    	<label>Account Type</label>
                    	<select class="form-control" name="gallery_category" id="gallery_category">
	              				<option value="">Select Gallery Category</option>
	              				<option value="events">Events</option>
	              				<option value="infrustructure">Infrustructure</option>
	              				<option value="campus_facilities">Campus & facilities</option>
	              				<option value="laboratories">Laboratories</option>
	              				<!-- <option value="5">Promotional Videos</option> -->
	              			</select>
                	  </div>
                  	<div class="form-group col-sm-12">
                  		<label>Gallery File</label>
                  		<div class="custom-file" id="gallery_file_div">
    									   <input type="file" class="custom-file-input" id="gallery_file" aria-describedby="gallery_file" name="gallery_file">
    									   <label class="custom-file-label" for="gallery_file">Choose File</label>
    									</div>
						             <input type="text" class="form-control" name="gallery_youtube_link" id="gallery_youtube_link" style="display: none;" placeholder="Youtube link">
                  	</div>
		        			</div>
		        			<div class="row">
		        				<div class="col-sm-12">
					               <button type="submit" class="btn btn-primary" id="btn_update_gallery" disabled>Upload</button>
					            </div>
		        			</div>
		        		</form>
		        	</div>
				</div>
			</div>
		</div>
	</div>
</div>