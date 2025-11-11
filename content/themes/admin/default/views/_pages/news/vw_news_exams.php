<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">News List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">News <?php echo (isset($exam_data))?'['.$exam_data->exam_short_name.']':'';?> <a href="<?php echo $admin_base_url;?>/exam_news/<?php echo $news_type_id;?>/add" class="btn btn-sm btn-primary pull-right" style="float:right;">Add</a></h6>
					<div class="col-md-12">
						<div class="table-responsive">
							<!-- <div>
						        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
						    </div> -->
							<table id="news_list_table" class="table">
								<thead>
			                      <tr>
			                        <th>#</th>
			                        <th>Title</th>
			                        <th>Published</th>
			                        <th>Created Date</th>
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

<script type="text/javascript">var news_type='3';var news_types_id='<?php echo $news_type_id;?>';</script>