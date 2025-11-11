<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Ads List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Ads <a href="<?php echo $admin_base_url;?>/ads/add" class="btn btn-sm btn-primary pull-right">Add</a></h6>
					<div class="col-md-12">
						<div class="table-responsive">
							<!-- <div>
						        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
						    </div> -->
							<table id="ads_free_imagelist_table" class="table">
								<thead>
			                      <tr>
			                        <th>#</th>
			                        <!-- <th>Ads Data</th> -->
			                        <th>Ads Image</th>
			                        <th>Ads Type</th>
			                        <th>Status</th>
			                        <!-- <th>Client Data</th> -->
			                        <!-- <th>End Date</th>
			                        <th>Start Date</th> -->
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