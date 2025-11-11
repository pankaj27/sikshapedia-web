<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="profile-content py-4">
  <div class="wrapper">
    <div class="row">
      <div class="col-lg-4 mb-12 mb-lg-0">
        <div class="card userCard">
          <div class="card-header bg-white">
            <h5 class="m-0 d-inline">Reset Account</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-lg-12" id="reset_msg" style="display:none;">
                
              </div>
            </div>

            <form id="form_get_credentials_reset" novalidate="novalidate" style="display:none;">
              <div class="row">
                <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">
                <div class="form-group col-sm-12">
                  <label>Verify OTP:<span class="span_star">(*)</span></label>                    
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" id="register_ph_otp" name="register_ph_otp" aria-describedby="register_ph_otp" placeholder="6 digit OTP" value="">
                    <div class="input-group-append">
                      <button class="btn btn-primary"  type="button" id="btn_otp_resend" style="display:none;">Resend OTP</button>
                    </div>
                  </div>
                  <label id="register_ph_otp-error" class="error" for="register_ph_otp" style="display:none;"></label>
                </div>
              </div>
              <div class="row">
                <div class="form-group col-sm-12">
                  <label>New Password:<span class="span_star">(*)</span></label>
                  <input type="password" class="form-control" id="register_new_pass" name="register_new_pass" aria-describedby="register_new_pass" placeholder="Enter password" value="">
                </div>
              </div>
              <div class="row">
                <div class="form-group col-sm-12">
                  <label>Confirm Password:<span class="span_star">(*)</span></label>
                  <input type="password" class="form-control" id="register_conf_new_pass" name="register_conf_new_pass" aria-describedby="register_conf_new_pass" placeholder="Reenter the password" value="">
                </div>
              </div>
              <div class="row">                 
                <div class="form-group col-sm-12">
                  <button type="submit" class="btn btn-primary pull-right" id="btn_verify_otp">Verify & Reset</button>
                </div>
                <div class="form-group col-sm-6">
                  <label id="timer" style="display:none;"></label>
                  <span id="attempts_left"></span>
                </div>
              </div>
            </form>


            <form id="form_get_credentials" novalidate="novalidate">
              <div class="row">
                <!-- <input type="hidden" name="data_type" value="general_settings"> -->
                <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">

                  <div class="form-group col-lg-12">
                    <label>Enter Registered Phon No. <span class="span_star">(*)</span></label>
                    <input type="text" class="form-control" id="register_phone_no" name="register_phone_no" aria-describedby="register_phone_no" placeholder="Enter Enter Registered Phon No." value="">
                  </div>
          
                  <div class="form-group col-sm-6">
                     <button type="submit" class="btn btn-primary pull-right" id="btn_reset_credentials">Submit</button>
                  </div>
              
                  <div class="form-group col-sm-6">
                    <span>Back to <a href="<?php echo base_url();?>signin" id="forget_link"> Sign in.</a> to your account</span>
                  </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    	<div class="col-lg-8 mb-4 mb-lg-0">
    		<div class="card userCard">
    				<div class="card-header bg-white">
	        	  <h5 class="m-0 d-inline">Top Colleges</h5> <small id="user_type" class="form-text text-muted">Top Colleges you may be interested in.</small>
	        	</div>
	        	<div class="card-body">

              <?php $this->widget->run('front_top_colleges_section',TRUE,['length'=>12,'view_type'=>'not_home_view']);?>

            </div>
    		</div>
    	</div>	    
    </div>
  </div>
</div>

<?php $this->widget->run('front_subscription_section',TRUE);?>

<script type="text/javascript">var wbpage='resetaccount';</script>

<style type="text/css">
  .chosen-container{
    z-index: 1800000;
  }
 .chosen-container-single{
    width: 100% !important;
    border-radius: 0px !important;
  }
  .chosen-drop{
    max-height: 150px !important;
  }

 .chosen-container .chosen-results {
    max-height: 100px !important;
  }

  .active-result .group-option .highlighted{
    background-color: #1b1f4c !important;
  }
  .span_star{
  	color: red;
  }
  .error{
  	color: red;
  }
</style>

<script type="text/javascript">var page='';</script>