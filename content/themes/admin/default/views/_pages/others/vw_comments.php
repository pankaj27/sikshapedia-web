<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/dashboard">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Colleges's List (Comments)</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">
						Comments
					</h6>
					<div class="table-responsive">
						<table id="comments_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Comments</th>
		                        <th>Colleges</th>
		                        <th>Users</th>
		                        <th>Date</th>
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

<script type="text/javascript">var p_row ='';var _college ='';</script>