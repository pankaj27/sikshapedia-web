<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Menus List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Menues  <button class="btn btn-primary" data-toggle="modal" data-target="#menuesModal">Generate Menu</button></h6>
					<div class="table-responsive">
						<table id="menu_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Menu</th>
		                        <th>Parent Menu</th>
		                        <th>Menu Link</th>
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

<div class="modal fade bd-example-modal-xl" id="menuesModal" tabindex="-1" role="dialog" aria-labelledby="menuesModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="menuesModal">Generate Menues</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_generate_menu">
	            <div class="modal-body">	            	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<div class="form-group">
							<label>Select File</label>
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
	                <button type="submit" class="btn btn-primary" id="btn_import_college">Upload</button>
	            </div>
            </form>
        </div>
    </div>
</div>