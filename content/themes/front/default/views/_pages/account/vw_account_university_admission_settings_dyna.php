<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="card userCard">
	<div class="card-header bg-white">
	  <h5 class="m-0 d-inline">Admission <?php echo date('Y');?> Information</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
	</div>
	<div class="card-body">
		<div class="row">
			<input type="hidden" name="data_type" value="admission_settings">
		</div>
	</div>
</div>