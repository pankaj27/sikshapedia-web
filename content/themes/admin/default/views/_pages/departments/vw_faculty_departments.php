<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Faculty Department List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Faculty Departments

						<button type="button" id="btn_add_department" class="btn btn-primary" data-target="#departmentsModal" data-toggle="modal" style="float:right;">Add</button>
					</h6>
					<div class="table-responsive">
						<table id="faculty_department_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>Department</th>
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



<div class="modal fade bd-example-modal-xl" id="departmentsModal" tabindex="-1" role="dialog" aria-labelledby="departmentsModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="departmentsModalTitle">Add Department</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_faculty_departments">
            	<div class="modal-body">
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<input type="hidden" name="_department" value="" id="_department">

            		<div class="row">
            			<div class="col-md-10">
            				<div class="form-group">
            					<label>Department Name</label>
            					<input type="text" class="form-control" name="department_name" id="department_name">
            				</div>
            			</div>
            			<div class="col-md-2">
            				<div class="form-group">
            					<label>Status</label>
            					<select class="form-control" name="department_status" id="department_status">
            						<option value="1">Active</option>
            						<option value="2">inactive</option>
            					</select>
            				</div>
            			</div>
            		</div>
            	</div>
            	<div class="modal-footer">
            		<button type="submit" class="btn btn-primary" id="btn_add_faculty_department">Save</button>
            	</div>
            </form>
        </div>
    </div>
</div>


<script type="text/javascript">
	var p_row='';
</script>