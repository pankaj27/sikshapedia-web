<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Affiliations List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Affiliations

						<button type="button" class="btn btn-primary" data-target="#affiliationsModal" data-toggle="modal" style="float:right;">Add</button>
					</h6>
					<div class="table-responsive">
						<table id="affiliation_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Name</th>
		                        <th>Abbr</th>
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



<div class="modal fade bd-example-modal-xl" id="affiliationsModal" tabindex="-1" role="dialog" aria-labelledby="affiliationsModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="affiliationsModalTitle">Add Affiliation</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_affiliations">
            	<div class="modal-body">
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<input type="hidden" name="_affiliation" value="" id="_affiliation">

            		<div class="row">
            			<div class="col-md-7">
            				<div class="form-group">
            					<label>Affiliations Name</label>
            					<input type="text" class="form-control" name="affiliation_name" id="affiliation_name">
            				</div>
            			</div>
            			<div class="col-md-3">
            				<div class="form-group">
            					<label>Affiliations Abbr</label>
            					<input type="text" class="form-control" name="affiliation_abbr_name" id="affiliation_abbr_name">
            				</div>
            			</div>
            			<div class="col-md-2">
            				<div class="form-group">
            					<label>Status</label>
            					<select class="form-control" name="affiliation_status" id="affiliation_status">
            						<option value="1">Active</option>
            						<option value="2">inactive</option>
            					</select>
            				</div>
            			</div>
            		</div>
            	</div>
            	<div class="modal-footer">
            		<button type="submit" class="btn btn-primary" id="btn_add_affiliation">Save</button>
            	</div>
            </form>
        </div>
    </div>
</div>


<script type="text/javascript">
	var p_row='';
</script>