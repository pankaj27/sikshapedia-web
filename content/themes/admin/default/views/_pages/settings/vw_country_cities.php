<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/settings/countries">Countries</a></li>
			<li class="breadcrumb-item active" aria-current="page">Cities List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">City - [ <?php echo $country_data->country_name;?> ]</h6>
					<form id="form_cities">
						<input type="hidden" name="_city" id="_city" value="">
						<div class="row">
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">State</label>
									<select class="form-control" name="city_state" id="city_state">
										<?php
										if(!empty($country_states)){
											//foreach ($country_states as $key => $value) {
												?>
												<option value="<?php echo $country_states['state_id'];?>" <?php echo $country_states['selected'];?>><?php echo $country_states['state_name'];?></option>
												<?php
											//}
										}
										?>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">City Name</label>
									<input type="text" class="form-control" placeholder="Enter city name" name="city_name" id="city_name">
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="city_status" id="city_status">
										<option value="1">Active</option>
										<option value="2">Deactive</option>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-3">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_city">Save</button>
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
					<h6 class="card-title">Cities - [ <?php echo $country_data->country_name;?> ]</h6>
					<div class="table-responsive">
						<table id="city_list_table" class="table">
							<thead>
		                      <tr>
		                        <th>#</th>
		                        <th>City</th>
		                        <th>State</th>
		                        <th>Slug</th>
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
<script type="text/javascript">var country='<?php echo $country_id;?>'; var state='<?php echo $state_id;?>';</script>