<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Search Lists</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Select Search Types</h6>
					<div class="col-md-12">
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page Country</label>
									<select class="form-control" id="page_country" name="page_country">
										<option value="0">Select Country</option>
										<option value="99">India</option>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page State</label>
									<select class="form-control" id="page_state" name="page_state">
										<option value="0">Select State</option>
									</select>
								</div>
							</div>
						</div>
					</div>	
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Colleges
						<?php
                    	if($userdata->user_role=='1'){
                    		?>
                    		 <button type="button" class="btn btn-xs btn-primary" id="_btn_gen_url" style="float:right;">Generate URLs</button>
                    		 <button type="button" class="btn btn-xs btn-primary" id="_btn_gen_searchdata" style="float:right;">Generate Search Data</button>
                    		<?php
                    	}
                    	?>
					</h6>
					<div class="col-md-12">
						<div class="table-responsive">
							<table id="seo_college_strcu_data_list_table" class="table">
								<thead>
			                      <tr>
			                      	<th>#</th>
			                        <th>Name</th>
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



<div class="modal fade bd-example-modal-xl" id="editCollegeStructureMetaModal" tabindex="-1" role="dialog" aria-labelledby="editCollegeStructureMetaModal" aria-hidden="true" style="width:100%;">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCollegeStructureMetaModalTitle">Edit College Search Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body" id="meta_div">

            	
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
	var p_row='';
</script>