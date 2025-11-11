<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="modal fade bd-example-modal-xl" id="changePassModal" tabindex="-1" role="dialog" aria-labelledby="changePassModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="changePassModalTitle">Change Password</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_update_data">
	            <div class="modal-body">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            		
            		<div class="row">
		            	<div class="col-md-4">
		            		<div class="form-group">
								<label>Old Password</label>
								<input type="text" class="form-control" placeholder="Old Password" name="user_old_password" id="user_old_password">
							</div>
						</div>
						<div class="col-md-4">
		            		<div class="form-group">
								<label>New Password</label>
								<input type="text" class="form-control" placeholder="New Password" name="user_new_password" id="user_new_password">
							</div>
						</div>
						<div class="col-md-4">
		            		<div class="form-group">
								<label>Confirm Password</label>
								<input type="text" class="form-control" placeholder="Confirm New Password" name="user_confirm_password" id="user_confirm_password">
							</div>
						</div>
					</div>	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_password">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>
