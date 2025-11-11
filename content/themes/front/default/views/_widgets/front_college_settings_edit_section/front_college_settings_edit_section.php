<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="row">
	<div class="col-lg-12 mb-4 mb-lg-0" id="gallery_tabs">
		<div class="card userCard">
			<div class="card-header bg-white">
			  <h5 class="m-0 d-inline">Account Informations</h5> <small id="user_type" class="form-text text-muted">Update your account details & settings</small>
			</div>
			<div class="card-body">
				
					<form id="form_info_settings" enctype="multipart/form-data">
						<input type="hidden" name="change_type" value="account_settings">
						<div class="row">
							<div class="form-group col-sm-12">
				                <label>Account User Name <small class="form-text text-muted">(to login into the system)</small></label>
				                <input type="text" class="form-control" id="registration_user_name" aria-describedby="registration_user_name" placeholder="Account User Name" value="<?php echo (isset($userdata->user_name))?$userdata->user_name:'';?>" disabled="disabled">
				            </div>
				        </div>
				        <div class="row">
				            <div class="form-group col-sm-12">
				                <label>Account Recovery E-mail <small class="form-text text-muted">(contact person email)</small></label>
				                <input type="text" class="form-control" id="registration_user_recovery_mail" name="registration_user_recovery_mail" aria-describedby="registration_user_recovery_mail" placeholder="Account Recovery E-mail" value="<?php echo (isset($college_profile_data->college_contact_person_email))?$college_profile_data->college_contact_person_email:'';?>">
				            </div>
				        </div>
				        <div class="row">

				            <div class="form-group col-sm-12">
				                <label>Account Recovery Phone No. <small class="form-text text-muted">(contact person phone no.)</small></label>
				                <input type="text" class="form-control" id="registration_user_recovery_phone" name="registration_user_recovery_phone" aria-describedby="registration_user_recovery_phone" placeholder="Account Recovery Phone No." value="<?php echo (isset($college_profile_data->college_contact_person_phone))?$college_profile_data->college_contact_person_phone:'';?>">
				            </div>
			            </div>

			            <div class="row">
			            	<div class="form-group col-sm-12">
				                <label>Account Contact Person Name</label>
				                <input type="text" class="form-control" id="registration_user_contact_person" name="registration_user_contact_person" aria-describedby="registration_user_contact_person" placeholder="Account Contact Person Name" value="<?php echo (isset($college_profile_data->college_contact_person))?$college_profile_data->college_contact_person:'';?>">
				            </div>
				        </div>
				        <div class="row">
				            <div class="form-group col-sm-12">
				                <label>Current Password</label>
				                <input type="password" class="form-control" id="registration_user_current_pass" name="registration_user_current_pass" aria-describedby="registration_user_current_pass" placeholder="Current Password" value="">
				            </div>
				        </div>
				        <div class="row">
				            <div class="form-group col-sm-12">
				                <label>New Password</label>
				                <input type="password" class="form-control" id="registration_user_new_pass" name="registration_user_new_pass" aria-describedby="registration_user_new_pass" placeholder="New Password" value="">
				            </div>					            
			            </div>

			           <!--  <div class="row">
			            	<div class="col-sm-12">
				               <button type="submit" class="btn btn-primary" id="btn_update_account_info">Update</button>
				            </div>
			            </div> -->

		            </form>

			</div>
		</div>
	</div>
</div>