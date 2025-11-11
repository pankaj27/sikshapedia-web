<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/dashboard">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Agency's List</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">
						Ranking Agencies
					</h6>
					<div class="table-responsive">
						<table id="agency_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Agency Name</th>
		                        <th>Agency Logo</th>
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


<div class="modal fade bd-example-modal-xl" id="agenciesModal" tabindex="-1" role="dialog" aria-labelledby="agenciesModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="agenciesModalTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_agency">
	            <div class="modal-body">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<input type="hidden" name="_agency" value="" id="_agency">
            		
		            <div class="row">
		            	<div class="col-md-6">
		            		<div class="form-group">
								<label>Agency Name</label>
								<input type="text" class="form-control" placeholder="Agency Name" name="agency_name" id="agency_name">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">	
							<div class="form-group">
								<label>Select File (Only .jpg file allowed)</label>
								<input type="file" name="agency_logo" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo">
									<span class="input-group-append">									
										<button class="file-upload-browse btn btn-primary" type="button">Browse</button>
									</span>
								</div>
							</div>
						</div>
					</div>           	
	            </div>
	            <div class="modal-footer">
	                <button type="submit" class="btn btn-primary" id="btn_add_agency">Save</button>
	            </div>
            </form>
        </div>
    </div>
</div>