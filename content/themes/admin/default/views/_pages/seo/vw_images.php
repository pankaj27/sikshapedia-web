<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item active" aria-current="page">Images's List</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<div class="col-sm-3">
						<select class="form-control" id="seo_image_list_select">
							<option value="user_logo">College Logo</option>
							<option value="user_banner">College Banner</option>
							<option value="exam_logo">Exam Logo</option>
						</select>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Images</h6>
					<div class="table-responsive">
						<table id="seo_image_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>File</th>
		                        <th>SEO Data</th>
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

<div class="modal fade bd-example-modal-xl" id="imageSEOQuickUpdateModal" tabindex="-1" role="dialog" aria-labelledby="imageSEOQuickUpdateModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="imageSEOQuickUpdateModalTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_image_seo_upload">
	            <div class="modal-body">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<input type="hidden" name="image_storage_id" id="image_storage_id" value="">
		            		
       				<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label>College Logo</label>
								<input type="file" name="college_logo" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="" id="image_name">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
									</span>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
								<label>Image Alt Text</label>
								<input type="text" class="form-control" name="image_logo_alt_text" id="image_alt_text">
							</div>
						</div>
					</div>
	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_image_quick">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>