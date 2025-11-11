<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">System College User's List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Users</h6>
					<div class="col-md-12">
						<div class="table-responsive">
							<!-- <div>
						        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
						    </div> -->
							<table id="college_user_list_table" class="table">
								<thead>
			                      <tr>
			                        <th>#</th>			                        
			                        <th>College Name</th>
			                        <th>Phone No.</th>
			                        <th>Email</th>
			                        <th>Status</th>
			                        <th>Action  <!-- <button class="btn btn-xs btn-primary" data-toggle="modal" data-target="#userRegModal">Add</button> --></th>
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

<div class="modal fade bd-example-modal-xl" id="userRegModal" tabindex="-1" role="dialog" aria-labelledby="userRegModal" aria-hidden="true">
	    <div class="modal-dialog modal-xl" role="document">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="userRegModal">Inner Menues</h5>
	                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	            </div>
	            <form id="form_college_inner_menues">
		            <div class="modal-body">	            	
		            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            		<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
		            		<div class="row">
		            			<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Select Menu Type</label>
										<select class="form-control" name="college_inner_menu_type" id="college_inner_menu_type">
											<option value="0">Select menu type</option>
											<?php
											if(!empty($inner_menues)){
												foreach ($inner_menues as $key => $value) {
													?>
													<option value="<?php echo $value->menu_type_id;?>" data-menu="<?php echo $value->menu_type_name;?>"><?php echo $value->menu_type_name;?></option>
													<?php
												}
											}

											?>
										</select>
									</div>
								</div>
		            			<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">Menu Name</label>
										<input type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_name" id="college_inner_menu_name" value="">
									</div>
								</div>
								<div class="col-sm-3">
				            		<div class="form-group">
										<label class="control-label">Menu Serial</label>
										<input type="text" class="form-control" placeholder="Enter Serial" name="college_inner_menu_serial" id="college_inner_menu_serial" value="">
									</div>
								</div>
								<div class="col-sm-3">
									<button type="submit" class="btn btn-primary" id="btn_college_inner_menues">Save</button>
								</div>
							</div>
		            	
		            </div>
		            <div class="modal-footer">
		                <div class="table-responsive">
							<table id="college_menu_type_list_table" class="table">
								<thead>
			                      <tr>
			                        <th>#</th>
			                        <th>Menu Type</th>
			                        <th>Menu Name</th>
			                        <th>Menu URL</th>
			                        <th>Action</th>
			                      </tr>
			                    </thead>
			                    <tbody>		                    	
			                    </tbody>
							</table>
						</div>
		            </div>
	            </form>
	        </div>
	    </div>
	</div>


<script type="text/javascript">let _user_type='4';</script>