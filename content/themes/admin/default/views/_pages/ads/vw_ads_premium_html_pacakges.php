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
					<h6 class="card-title">Ads <a href="<?php echo $admin_base_url;?>/ads/add" class="btn btn-sm btn-primary" style="float:right;">Add</a></h6>
					<div class="col-md-12">
						<div class="table-responsive">
							<!-- <div>
						        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
						    </div> -->
							<table id="ads_list_table" class="table">
								<thead>
			                      <tr>
			                        <th>#</th>
			                        <th>Ads Data</th>
			                        <th>Ads Position</th>
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

<style type="text/css">
	.navFooter {
	    background: #fff;
	    padding: 10px 15px;
	    border: 1px solid #ddd;
	}
	.navFooter .navMedia .media-body h5 {
	    font-size: 14px;
	    font-weight: 500;
	    margin: 0;
	    margin-bottom: 5px;
	    color: #4d586c;
	}

	.navFooter .navMedia .media-body h5 a {
	    color: #4d586c;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    display: block;
	}

	.navFooter .navMedia .media-body h5 a {
	    color: #4d586c;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    display: block;
	}

	.media {
	    display: -ms-flexbox;
	    display: flex;
	    -ms-flex-align: start;
	    align-items: flex-start;
	}

	.form-row {
    	display: -ms-flexbox;
	    display: flex;
	    -ms-flex-wrap: wrap;
	    flex-wrap: wrap;
	    margin-right: -5px;
	    margin-left: -5px;
	}
</style>