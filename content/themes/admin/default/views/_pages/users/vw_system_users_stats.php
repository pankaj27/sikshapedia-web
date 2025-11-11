<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">System User's List</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">User:<?php echo $internal_userdata->user_fullname;?> [<?php echo $internal_userdata->user_role_name;?>]</h6>
					<div class="col-md-12">
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Start Date</label>
									<div class="d-flex align-items-center flex-wrap text-nowrap">
										<div class="input-group date datepicker dashboard-date mr-2 mb-2 mb-md-0 d-md-none d-xl-flex" id="dashboardDate">
							              <span class="input-group-addon bg-transparent"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar  text-primary"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
							              <input type="text" class="form-control" id="start_date">
							            </div>
							        </div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>End Date</label>
									<div class="d-flex align-items-center flex-wrap text-nowrap">
										<div class="input-group date datepicker dashboard-date mr-2 mb-2 mb-md-0 d-md-none d-xl-flex" id="dashboardDate">
							              <span class="input-group-addon bg-transparent"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar  text-primary"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
							              <input type="text" class="form-control" id="end_date">
							            </div>
							        </div>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>State</label>
									<select class="form-control" id="stat_state">
										<!-- <option value="0">All States</option> -->
										<?php
										foreach ($states as $key => $value) {
											?>
											<option value="<?php echo $value['state_id'];?>"><?php echo $value['state_name'];?></option>
											<?php
										}
										?>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<button class="btn btn-sm btn-primary" type="button" style="margin-top: 33px;" id="view_stat">View</button>
									<a href="" id="file_to_download" download></a>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12" id="stat_msg"></div>
							<div class="table-responsive">
								<!-- <div>
							        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
							    </div> -->
								<table id="user_stat_list_table" class="table">
									<thead>
				                      <tr>
				                        <th>#</th>
				                        <th>Institute Name</th>
				                        <th>Logo/Banner Update Date</th>				                        
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

<script type="text/javascript">var _user_type='';var user_id='<?php echo encode_data($internal_userdata->user_id);?>';</script>