<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="card userCard">
	<div class="card-header bg-white">
	  <h5 class="m-0 d-inline">Colleges</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
	</div>
	<div class="card-body">
		<div class="row">
			<input type="hidden" name="data_type" value="colleges_settings">

			<div class="form-group col-sm-6">
                <label>College Name</label>
                <input type="text" class="form-control" id="registration_name" name="registration_name" aria-describedby="registration_name" placeholder="Enter Name" value="<?php echo isset($userdata)?$userdata->user_fullname:'';?>">
            </div>
		</div>
	</div>
</div>