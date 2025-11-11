<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">System User's List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Users <a href="<?php echo $admin_base_url;?>/institutions/colleges/add" class="btn btn-sm btn-primary pull-right">Add</a>  <button class="btn btn-primary" data-toggle="modal" data-target="#collegeImportModal">Import</button></h6>
					<div class="col-md-12">
						<div class="table-responsive">
							<!-- <div>
						        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
						    </div> -->
							<table id="user_list_table" class="table">
								<thead>
			                      <tr>
			                        <th>#</th>
			                        <th>User Name</th>
			                        <th>Full Name</th>
			                        <th>Phone No.</th>
			                        <th>Email</th>
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
</div>