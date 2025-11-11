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
					<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
					<input type="hidden" name="settings_type" value="<?php echo encode_data('general_settings');?>">
					<div class="form-group row">
						<div class="col-md-4">
							<label for="system_meta_title">System Name</label>
							<input type="text" class="form-control" id="system_name" name="system_name" autocomplete="off" placeholder="System Name" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_name))?$system_general_settings->system_name:'';?>">
						</div>
						<div class="col-md-4">
							<label for="system_assests_domain">System Assests Domain</label>
							<input type="text" class="form-control" id="system_assests_domain" name="system_assests_domain" autocomplete="off" placeholder="System Assests Domain" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_assests_domain))?$system_general_settings->system_assests_domain:'';?>">
						</div>
						<div class="col-md-4">
							<label for="system_assests_domain_path">System Assests Domain Path</label>
							<input type="text" class="form-control" id="system_assests_domain_path" name="system_assests_domain_path" autocomplete="off" placeholder="System Assests Domain Path" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_assests_domain_path))?$system_general_settings->system_assests_domain_path:'';?>">
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-12">
							<label for="system_meta_title">System Meta Title</label>
							<input type="text" class="form-control" id="system_meta_title" name="system_meta_title" autocomplete="off" placeholder="System Meta Title" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_meta_title))?$system_general_settings->system_meta_title:'';?>">
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-6">
							<label for="system_meta_desc">System Meta Description</label>
							<textarea class="form-control" id="system_meta_desc" name="system_meta_desc" placeholder="System Meta Description" rows="5"><?php echo (isset($system_general_settings) && isset($system_general_settings->system_meta_desc))?$system_general_settings->system_meta_desc:'';?></textarea>
						</div>
					
						<div class="col-md-6">
							<label for="system_meta_desc">System Meta Keywords</label>
							<textarea class="form-control" id="system_meta_keywords" name="system_meta_keywords" placeholder="System Meta Description" rows="5"><?php echo (isset($system_general_settings) && isset($system_general_settings->system_meta_keywords))?$system_general_settings->system_meta_keywords:'';?></textarea>
						</div>
					</div>

					<div class="form-group row">
						<div class="col-md-6">
							<label for="system_gtag_manager">System Google Tag Manager</label>
							<textarea class="form-control" id="system_gtag_manager" name="system_gtag_manager" placeholder="System Google Tag Manager" rows="7"><?php echo (isset($system_general_settings) && isset($system_general_settings->system_gtag_manager))?$system_general_settings->system_gtag_manager:'';?></textarea>
						</div>
					
						<div class="col-md-6">
							<label for="system_gtag_manager_noscript">System Google Tag Manager (noscript)</label>
							<textarea class="form-control" id="system_gtag_manager_noscript" name="system_gtag_manager_noscript" placeholder="System Google Tag Manager" rows="7"><?php echo (isset($system_general_settings) && isset($system_general_settings->system_gtag_manager_noscript))?$system_general_settings->system_gtag_manager_noscript:'';?></textarea>
						</div>
					</div>

					<div class="form-group row">
						<div class="col-md-6">
							<label for="system_gaddsensetag_manager">System Google Adsense Tag Manager</label>
							<textarea class="form-control" id="system_gaddsensetag_manager" name="system_gaddsensetag_manager" placeholder="System Adsense Tag Manager" rows="7"><?php echo (isset($system_general_settings) && isset($system_general_settings->system_gaddsensetag_manager))?$system_general_settings->system_gaddsensetag_manager:'';?></textarea>
						</div>
					
						<div class="col-md-6">
							<label for="system_application_ld_json">System application/ld+json</label>
							<textarea class="form-control" id="system_application_ld_json" name="system_application_ld_json" placeholder="System application/ld+json" rows="7"><?php echo (isset($system_general_settings) && isset($system_general_settings->system_application_ld_json))?$system_general_settings->system_application_ld_json:'';?></textarea>
						</div>
					</div>

					<div class="form-group row">
						<div class="col-md-4">
							<label for="system_meta_desc">System Auto Email</label>
							<input type="text" class="form-control" id="system_auto_email" name="system_auto_email" autocomplete="off" placeholder="System Auto Email" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_auto_email))?$system_general_settings->system_auto_email:'';?>">
						</div>
						<div class="col-md-4">
							<label for="system_meta_desc">System Info Email</label>
							<input type="text" class="form-control" id="system_info_email" name="system_info_email" autocomplete="off" placeholder="System Info Email" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_info_email))?$system_general_settings->system_info_email:'';?>">
						</div>
						<div class="col-md-4">
							<label for="system_meta_desc">System Webmaster Email</label>
							<input type="text" class="form-control" id="system_web_master_email" name="system_web_master_email" autocomplete="off" placeholder="System Webmaster Email" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_web_master_email))?$system_general_settings->system_web_master_email:'';?>">
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-4">
							<label for="system_hr_email">System HR Email</label>
							<input type="text" class="form-control" id="system_hr_email" name="system_hr_email" autocomplete="off" placeholder="System HR Email" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_hr_email))?$system_general_settings->system_hr_email:'';?>">
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-4">
							<label for="system_webmaster_ph">System Phone No</label>
							<input type="text" class="form-control" id="system_hr_email" name="system_webmaster_ph" autocomplete="off" placeholder="System Phone No." value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_webmaster_ph))?$system_general_settings->system_webmaster_ph:'';?>">
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<label for="system_google_client_id">System Google Client ID</label>
							<input type="text" class="form-control" id="system_google_client_id" name="system_google_client_id" autocomplete="off" placeholder="System Google Client ID" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_google_client_id))?$system_general_settings->system_google_client_id:'';?>">
						</div>
						<div class="col-md-6">
							<label for="system_google_secret_key">System Google Client Secret</label>
							<input type="text" class="form-control" id="system_google_secret_key" name="system_google_secret_key" autocomplete="off" placeholder="System Google Client Secret" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_google_secret_key))?$system_general_settings->system_google_secret_key:'';?>">
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<label for="system_fb_app_secret">System Facebook APP Secret</label>
							<input type="text" class="form-control" id="system_fb_app_secret" name="System Facebook APP Secret" autocomplete="off" placeholder="System Facebook APP Secret" value="<?php echo (isset($system_general_settings) && isset($system_general_settings->system_fb_app_secret))?$system_general_settings->system_fb_app_secret:'';?>">
						</div>
					</div>

					<div class="row">
						<div class="col-sm-4">
							<div class="form-group">
								<label>System Logo</label>
								<input type="file" name="system_logo" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="<?php echo (!empty($college_data))?$college_data['college_logo_name']:'';?>">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
									</span>
								</div>
							</div>
						</div>
						<div class="col-sm-4">
							<div class="form-group">
								<label>System White Logo</label>
								<input type="file" name="system_logo_white" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="<?php echo (!empty($college_data))?$college_data['college_logo_name']:'';?>">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
									</span>
								</div>
							</div>
						</div>
						<div class="col-sm-4">
							<div class="form-group">
								<label>System Small Logo</label>
								<input type="file" name="system_logo_small" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="<?php echo (!empty($college_data))?$college_data['college_logo_name']:'';?>">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-3">
							<div class="form-group">
								<label>System Favicon</label>
								<input type="file" name="system_favicon" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Favicon" value="<?php echo (!empty($college_data))?$college_data['college_banner_name']:'';?>">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Favicon</button>
									</span>
								</div>
							</div>
						</div>
						<div class="col-sm-3">
							<div class="form-group">
								<label>System Apple Store Logo</label>
								<input type="file" name="system_apple_store_logo" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Banner" value="<?php echo (!empty($college_data))?$college_data['college_banner_name']:'';?>">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
									</span>
								</div>
							</div>
						</div>
						<div class="col-sm-3">
							<div class="form-group">
								<label>System Play Store Logo</label>
								<input type="file" name="system_play_store_logo" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Banner" value="<?php echo (!empty($college_data))?$college_data['college_banner_name']:'';?>">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
									</span>
								</div>
							</div>
						</div>
						<div class="col-sm-3">
							<div class="form-group">
								<label>System Mobile App Image</label>
								<input type="file" name="system_mobile_app_image" class="file-upload-default">
								<div class="input-group col-xs-12">
									<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Banner" value="<?php echo (!empty($college_data))?$college_data['college_banner_name']:'';?>">
									<span class="input-group-append">
										<button class="file-upload-browse btn btn-primary" type="button">Browse App Image</button>
									</span>
								</div>
							</div>
						</div>
					</div>

					<button type="submit" class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" id="btn_submit">Save Settings</button>
				</form>
              </div>
            </div>
		</div>
	</div>

</div>