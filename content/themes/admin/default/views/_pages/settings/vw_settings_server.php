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
				<h6 class="card-title">System Settings</h6>
				<form class="forms-sample" id="form_settings" autocomplete="off" method="post">
					<div class="form-group row">
						<div class="col-md-12">
							<label for="system_meta_title">System Meta Title</label>
							<input type="text" class="form-control" id="system_meta_title" name="system_meta_title" autocomplete="off" placeholder="System Meta Title" value="<?php echo isset($system_settings)?$system_settings->system_meta_title:'';?>">
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-6">
							<label for="system_meta_desc">System Meta Description</label>
							<textarea class="form-control" id="system_meta_desc" name="system_meta_desc" placeholder="System Meta Description" rows="5"><?php echo isset($system_settings)?$system_settings->system_meta_desc:'';?></textarea>
						</div>
					
						<div class="col-md-6">
							<label for="system_meta_desc">System Meta Keywords</label>
							<textarea class="form-control" id="system_meta_keywords" name="system_meta_keywords" placeholder="System Meta Description" rows="5"><?php echo isset($system_settings)?$system_settings->system_meta_keywords:'';?></textarea>
						</div>
					</div>

					<div class="form-group row">
						<div class="col-md-4">
							<label for="system_meta_desc">System Contact Email</label>
							<input type="text" class="form-control" id="system_contact_email" name="system_contact_email" placeholder="System Contact Email" value="<?php echo isset($system_settings)?$system_settings->system_contact_email:'';?>">
						</div>
						<div class="col-md-4">
							<label for="system_meta_desc">System Webmaster Email</label>
							<input type="text" class="form-control" id="system_webmaster_email" name="system_webmaster_email" placeholder="System Webmaster Email" value="<?php echo isset($system_settings)?$system_settings->system_webmaster_email:'';?>">
						</div>
						<div class="col-md-4">
							<label for="system_meta_desc">System Webmaster Phone No.</label>
							<input type="text" class="form-control" id="system_webmaster_ph" name="system_webmaster_ph" placeholder="System Webmaster Phone No." value="<?php echo (isset($system_settings) && isset($system_settings->system_webmaster_ph))?$system_settings->system_webmaster_ph:'';?>">
						</div>
					</div>

					<div class="form-group row">
						<div class="col-md-6">
							<label for="system_meta_desc">Facebook Link</label>
							<input type="text" class="form-control" id="system_facebook_link" name="system_facebook_link" placeholder="Facebook Link" value="<?php echo (isset($system_settings) && isset($system_settings->system_facebook_link))?$system_settings->system_facebook_link:'';?>">
						</div>
						<div class="col-md-6">
							<label for="system_meta_desc">Google Link</label>
							<input type="text" class="form-control" id="system_google_link" name="system_google_link" placeholder="Google Link" value="<?php echo (isset($system_settings) && isset($system_settings->system_google_link))?$system_settings->system_google_link:'';?>">
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-6">
							<label for="system_meta_desc">Linkedin Link</label>
							<input type="text" class="form-control" id="system_linkedin_link" name="system_linkedin_link" placeholder="Linkedin Link" value="<?php echo (isset($system_settings) && isset($system_settings->system_linkedin_link))?$system_settings->system_linkedin_link:'';?>">
						</div>
						<div class="col-md-6">
							<label for="system_meta_desc">Twitter Link</label>
							<input type="text" class="form-control" id="system_twitter_link" name="system_twitter_link" placeholder="Twitter Link" value="<?php echo (isset($system_settings) && isset($system_settings->system_twitter_link))?$system_settings->system_twitter_link:'';?>">
						</div>
					</div>

					<button type="submit" class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" id="btn_submit">Save Settings</button>
				</form>
              </div>
            </div>
		</div>
	</div>

</div>