<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Colleges List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Colleges <a href="<?php echo $admin_base_url;?>/institutions/colleges/add" class="btn btn-sm btn-primary pull-right">Add</a>  <button class="btn btn-primary" data-toggle="modal" data-target="#collegeImportModal">Import</button></h6>

					<div class="table-responsive">
						<table id="widget_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Name</th>
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