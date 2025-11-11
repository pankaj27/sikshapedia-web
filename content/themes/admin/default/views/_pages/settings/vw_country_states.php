<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/settings/countries">Countries</a></li>
			<li class="breadcrumb-item active" aria-current="page">States List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">States - [ <?php echo $country_data->country_name;?> ]</h6>
					<form id="form_states">
						<div class="row">
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">State Name</label>
									<input type="text" class="form-control" placeholder="Enter state name" name="state_name">
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">State Serial</label>
									<input type="text" class="form-control" placeholder="State serial" name="state_serial">
								</div>
							</div>

							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="state_status">
										<option value="1">Active</option>
										<option value="2">Deactive</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-3">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_state">Save</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">States - [ <?php echo $country_data->country_name;?> ]</h6>
					<div class="table-responsive">
						<table id="state_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>State</th>
		                        <th>Cities</th>
		                        <th>Slug</th>
		                        <th>Status</th>
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
<script type="text/javascript">var country='<?php echo encode_data($country_data->country_id);?>';</script>