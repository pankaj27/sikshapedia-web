<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">College Review List</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-header">
					<h6 class="card-title">Reviews
						<a href="<?php echo $admin_base_url;?>/institutions/colleges/reviews/add/<?php echo $college_id;?>" class="btn btn-sm btn-primary pull-right" id="btn_add_college_review" style="float:right !important;">Add Review</a>
					</h6>
				</div>
				<div class="card-body">
					<div class="row">
						<div class="col-md-12">
						<div class="table-responsive">
							<table id="anonymous_review_list_table" class="table">
								<thead>
			                      <tr>
			                        <th>#</th>
			                        <th>Review Title</th>
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

</div>

<script type="text/javascript">
	var _college_id='<?php echo $college_id;?>';
</script>