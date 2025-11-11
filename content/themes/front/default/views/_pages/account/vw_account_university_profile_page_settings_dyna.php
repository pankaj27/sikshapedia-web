<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="card userCard">
	<div class="card-header bg-white">
	  <h5 class="m-0 d-inline">Page Setttings</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
	</div>
	<div class="card-body">
		<div class="row">
			<input type="hidden" name="data_type" value="page_settings">
			<div class="form-group col-sm-12">
				<label>Page Main Title</label>
                <input type="text" class="form-control" id="registration_title" name="registration_title" aria-describedby="registration_title" placeholder="Enter Name" value="<?php echo (isset($userdata) && isset($userdata->user_meta_title))?$userdata->user_meta_title:'';?>">
			</div>
			<div class="form-group col-sm-12">
				<label>Page Keywords</label>
                <input type="text" class="form-control" id="registration_keywords" name="registration_keywords" aria-describedby="registration_keywords" placeholder="Enter Name" value="<?php echo (isset($userdata) && isset($userdata->user_meta_keywords))?$userdata->user_meta_keywords:'';?>">
			</div>
			<div class="form-group col-sm-12">
				<label>Page Short Description</label>
                <textarea class="form-control" id="registration_short_description" name="registration_short_description" aria-describedby="registration_short_description" rows="2"><?php echo (isset($userdata) && isset($userdata->user_meta_description))?$userdata->user_meta_description:'';?></textarea>
			</div>
			<div class="form-group col-sm-3">
				<label>Page Logo</label>
				<div class="custom-file">
				    <input type="file" class="custom-file-input" id="registration_logo" aria-describedby="registration_logo" name="registration_logo">
				    <label class="custom-file-label" for="registration_logo">Choose Logo</label>
				</div>
			</div>
			<div class="form-group col-sm-9">
				<label>Page Banner</label>
				<div class="custom-file">
				    <input type="file" class="custom-file-input" id="registration_banner" name="registration_banner" aria-describedby="registration_banner">
				    <label class="custom-file-label" for="registration_banner">Choose Banner</label>
				</div>
			</div>

			<?php
			if(isset($user_logo) && !empty($user_logo)){
				?>
				<div class="form-group col-sm-3">
					<div class="thumbnail">
				      <a href="<?php echo $user_logo;?>">
				        <img src="<?php echo $user_logo;?>" alt="Lights" style="width:100%">
				      </a>
				    </div>
				</div>
				<?php
			}
			
			if(isset($user_banner) && !empty($user_banner)){
				?>
				<div class="form-group col-sm-9">
					<div class="form-group col-sm-12">
					<div class="thumbnail">
				      <a href="<?php echo $user_banner;?>">
				        <img src="<?php echo $user_banner;?>" alt="Lights" style="width:100%">
				      </a>
				    </div>
				</div>
				</div>
				<?php
			}
			?>
			<div class="col-sm-12">
               <button type="submit" class="btn btn-primary" id="btn_update_page">Update</button>
            </div>
		</div>
	</div>
</div>