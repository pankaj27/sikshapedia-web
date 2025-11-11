<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Blog Posts List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Posts</h6>
					<div class="table-responsive">
						<table id="blog_posts_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Title</th>
		                        <th>Author</th>
		                        <th>categories</th>
		                        <th>Status</th>
		                        <th>Date</th>
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

<script type="text/javascript">
	var p_row='';
</script>