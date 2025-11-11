<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">

	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="dashboard">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">System Social Settings</li>
		</ol>
	</nav>

	<div class="row">					
		<div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
				<h6 class="card-title">System Social Settings</h6>
				<form class="forms-sample" id="form_settings" autocomplete="off" method="post">
					<input type="hidden" name="settings_type" value="<?php echo encode_data('social_settings');?>">

					<div class="form-group row">
						<div class="col-md-6">
							<label for="system_meta_desc">Facebook Link</label>
							<input type="text" class="form-control" id="system_facebook_link" name="system_facebook_link" placeholder="Facebook Link" value="<?php echo (isset($system_social_settings) && isset($system_social_settings->system_facebook_link))?$system_social_settings->system_facebook_link:'';?>">
						</div>
						<div class="col-md-6">
							<label for="system_meta_desc">Google Link</label>
							<input type="text" class="form-control" id="system_google_link" name="system_google_link" placeholder="Google Link" value="<?php echo (isset($system_social_settings) && isset($system_social_settings->system_google_link))?$system_social_settings->system_google_link:'';?>">
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-6">
							<label for="system_meta_desc">Linkedin Link</label>
							<input type="text" class="form-control" id="system_linkedin_link" name="system_linkedin_link" placeholder="Linkedin Link" value="<?php echo (isset($system_social_settings) && isset($system_social_settings->system_linkedin_link))?$system_social_settings->system_linkedin_link:'';?>">
						</div>
						<div class="col-md-6">
							<label for="system_meta_desc">Twitter Link</label>
							<input type="text" class="form-control" id="system_twitter_link" name="system_twitter_link" placeholder="Twitter Link" value="<?php echo (isset($system_social_settings) && isset($system_social_settings->system_twitter_link))?$system_social_settings->system_twitter_link:'';?>">
						</div>
					</div>

					<button type="submit" class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" id="btn_submit">Save Settings</button>


					<button type="button" class="btn btn-success" data-toggle="modal" data-target="#newFolderModal">New Folder</button>
				</form>
              </div>
            </div>
		</div>
	</div>

</div>



<div class="modal fade" id="newFolderModal" tabindex="-1" role="dialog" aria-labelledby="newFolderModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <form class="forms-sample" id="form_folder_browser" role="form" name="form_folder_browser" method="POST" autocomplete="off">
        <div class="modal-header">
          <h5 class="modal-title" id="newFolderModalLabel">New Folder</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          
          <div class="form-group">
            <input type="text" class="form-control" id="folder_name" name="folder_name" placeholder="Enter folder name">
          </div>
          <div class="form-group diverror"></div>
          
        
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" id="btn_create_btn">Create</button>
        </div>
      </form>
    </div>
  </div>
</div>