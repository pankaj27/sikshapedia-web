<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">

	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="dashboard">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">System General Settings</li>
		</ol>
	</nav>

	<div class="row">					
		<div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
				<h6 class="card-title">System General Settings</h6>
				<form class="forms-sample" id="form_settings" autocomplete="off" method="post">
					<input type="hidden" name="settings_type" value="<?php echo encode_data('email_settings');?>">


					<div class="form-group row">
						<div class="col-md-4">
							<label for="system_meta_desc">System Contact Email</label>
							<input type="text" class="form-control" id="system_contact_email" name="system_contact_email" placeholder="System Contact Email" value="<?php echo (isset($system_email_settings) && isset($system_email_settings->system_contact_email))?$system_email_settings->system_contact_email:'';?>">
						</div>
						<div class="col-md-4">
							<label for="system_meta_desc">System Webmaster Email</label>
							<input type="text" class="form-control" id="system_webmaster_email" name="system_webmaster_email" placeholder="System Webmaster Email" value="<?php echo (isset($system_email_settings) && isset($system_email_settings->system_webmaster_email))?$system_email_settings->system_webmaster_email:'';?>">
						</div>
						<div class="col-md-4">
							<label for="system_meta_desc">System Webmaster Phone No.</label>
							<input type="text" class="form-control" id="system_webmaster_ph" name="system_webmaster_ph" placeholder="System Webmaster Phone No." value="<?php echo (isset($system_email_settings) && isset($system_email_settings->system_webmaster_ph))?$system_email_settings->system_webmaster_ph:'';?>">
						</div>
					</div>

					<button type="submit" class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" id="btn_submit">Save Settings</button>
				</form>
              </div>
            </div>
		</div>
	</div>

</div>