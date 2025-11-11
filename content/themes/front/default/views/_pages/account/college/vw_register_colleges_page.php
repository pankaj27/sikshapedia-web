<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="profile-content py-4">
  <div class="wrapper">
    <div class="row">
    	<!-- <div class="col-lg-4 mb-4 mb-lg-0">
    		<div class="card userCard">
    			<div class="card-header bg-white">
	        	  <h5 class="m-0 d-inline">General Settings</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
	        	</div>
    		</div>
    	</div> -->
	    <div class="col-lg-12 mb-4 mb-lg-0">
	        <div class="card userCard">
	        	<div class="card-header bg-white">
	        	  <h5 class="m-0 d-inline">Register with <?php echo $system_name_title;?></h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
	        	</div>
	        	<div class="card-body">
	        		<div class="row">
	        			<div class="col-lg-12">
	        				<div class="alert alert-info">If your college is Deemed to be University then <a href="<?php echo base_url();?>signup/university">click here</a> to register as University.
	        				</div> 
	        			</div>
	        		</div>
	        		<div class="row">
	        			<div class="col-lg-12" id="register_msg" style="display:none;">
	        				
	        			</div>
	        		</div>

	        		<form id="form_college_verify_otp" novalidate="novalidate" style="display:none;">
	        			<div class="row">
	        				<div class="form-group col-sm-4">
                    <label>Contact Person Phone no</label>
                    <input type="text" class="form-control" id="register_college_contact_person_phone_no" name="register_college_contact_person_phone_no" aria-describedby="register_college_phone_no" placeholder="Enter Official Phone No." value="" disabled="true">
                	</div>
                	<div class="form-group col-sm-4">
                    <label>Contact Person Official Email</label>
                    <input type="text" class="form-control" id="register_college_contact_person_email" name="register_college_contact_person_email" aria-describedby="register_college_phone_no" placeholder="Enter Official Email." value="" disabled="true">
                	</div>
                	<div class="form-group col-sm-4">
                    <label>College Official Person Email</label>
                    <input type="text" class="form-control" id="register_college_college_email" name="register_college_college_email" aria-describedby="register_college_phone_no" placeholder="Enter Official Email." value="" disabled="true">
                	</div>
	        			</div>
	        			<div class="row">
	        				<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">
	        				<div class="form-group col-sm-6">
	        					<label>Verify phone number.:<span class="span_star">(*)</span></label>                    
                    <div class="input-group mb-3">
	                    <input type="text" class="form-control" id="register_ph_otp" name="register_ph_otp" aria-describedby="register_ph_otp" placeholder="6 digit OTP" value="">
	                    <div class="input-group-append">
	                      <button class="btn btn-primary"  type="button" id="btn_otp_resend" style="display:none;">Resend OTP</button>
	                    </div>
	                  </div>
	                  <label id="register_ph_otp-error" class="error" for="register_ph_otp" style="display:none;"></label>
	        				</div>
	        				<div class="form-group col-sm-6">
	        					<label>Verify email:<span class="span_star">(*)</span></label>
                    <div class="input-group mb-3">
	                    <input type="text" class="form-control" id="register_email_otp" name="register_email_otp" aria-describedby="register_email_otp" placeholder="6 digit OTP" value="">
	                  </div>
	                  <label id="register_email_otp-error" class="error" for="register_email_otp" style="display:none;"></label>
	        				</div>
	        			</div>
	        			<div class="row">	        				
        					<div class="form-group col-sm-6">
                    <button type="submit" class="btn btn-primary pull-right" id="btn_verify_otp">Verify</button>
                  </div>
                  <div class="form-group col-sm-6">
	        					<label id="timer" style="display:none;"></label>
	        					<span id="attempts_left"></span>
	        				</div>
                </div>
	        		</form>

	            <form id="form_college_register" novalidate="novalidate">
	              <div class="row">
	                <!-- <input type="hidden" name="data_type" value="general_settings"> -->
	                <input type="hidden" name="register_college_user_type" value="<?php echo encode_data(4);?>">
	                <input type="hidden" name="register_college_from" id="register_college_from" value="<?php echo $reg_from;?>">
	                <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">

	                <div class="form-group col-sm-12">
                      <label>College Name <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_college_name" name="register_college_name" aria-describedby="register_college_name" placeholder="Enter Name" value="">
                  	</div>
                  	<div class="form-group col-sm-6">
                      <label>College Email <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_college_email" name="register_college_email" placeholder="Enter Official Email" value="">
                  	</div>
                  	<div class="form-group col-sm-6">
                      <label>College Phone no <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_college_phone_no" name="register_college_phone_no" aria-describedby="register_college_phone_no" placeholder="Enter Official Phone No." value="">
                  	</div>

                  	<div class="form-group col-sm-6">
	                    <label for="inputState">Country <span class="span_star">(*)</span></label>
	                    <select class="form-control chosen-select" name="register_college_country" id="register_college_country">
	                      <option value="0">Select Country</option>
	                      <?php
	                        if(!empty($countries)){
	                          foreach ($countries as $key => $value) {
	                            ?>
	                            <option value="<?php echo $value['country_id'];?>"><?php echo $value['country_name'];?></option>
	                            <?php
	                          }
	                        }
	                      ?>
	                    </select>
	                </div>

	                <div class="form-group col-sm-6">
	                    <label for="inputState">State/Province <span class="span_star">(*)</span></label>
	                    <select class="form-control chosen-select" name="register_college_state" id="register_college_state">
	                      <option value="0">Select State/Province</option>
	                      <?php
	                      if(isset($states) && !empty($states)){
	                      	foreach ($states as $key => $value) {
	                      		?>
	                      		<option value="<?php echo $value['state_id'];?>" <?php echo $value['selected'];?>><?php echo $value['state_name'];?></option>
	                      		<?php
	                      	}
	                      }
	                      ?>
	                    </select>
	                </div>

	                <div class="form-group col-sm-6">
	                    <label for="inputState">District (Optional)</label>
	                    <select class="form-control" name="register_college_district" id="register_college_district">
	                      <option value="0">Select District</option>
	                    </select>
	                </div>

	                <div class="form-group col-sm-6">
	                    <label for="inputState">City/Town <span class="span_star">(*)</span></label>
	                    <select class="form-control chosen-select" name="register_college_city" id="register_college_city">
	                      <option value="0">Select City/Town</option>
	                      <?php
	                      if(isset($cities) && !empty($cities)){
	                        foreach ($cities as $key => $value) {
	                          ?>
	                          <option value="<?php echo $value['city_id'];?>" <?php echo $value['selected'];?>><?php echo $value['city_name'];?></option>
	                          <?php
	                        }
	                      }
	                      ?>
	                    </select>
	                </div>

                  	<div class="form-group col-sm-8">
	                    <label for="inputState">University (Affiliated under)</label>
		                    <select class="form-control chosen-select" name="register_college_university" id="register_college_university">
		                      <option value="0">Select University</option>
		                      <?php
		                        if(!empty($countries)){
		                          foreach ($countries as $key => $value) {
		                            ?>
		                            <option value="<?php echo $value['country_id'];?>" <?php echo $value['selected'];?>><?php echo $value['country_name'];?></option>
		                            <?php
		                          }
		                        }
		                      ?>
		                    </select>
		                </div>


	                <div class="form-group col-sm-4">
	                    <label for="inputState">College Type <span class="span_star">(*)</span></label>
	                    <select class="form-control chosen-select" name="register_college_type" id="register_college_type">
	                      <option value="0">Select Type</option>
	                      <?php
	                        if(!empty($institue_types)){
	                          foreach ($institue_types as $key => $value) {
	                            ?>
	                            <option value="<?php echo $value['inst_type'];?>"><?php echo $value['inst_type_name'];?></option>
	                            <?php
	                          }
	                        }
	                      ?>
	                    </select>
	                </div>

                  	<div class="form-group col-sm-6">
                      <label>Pincode <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_college_pincode" name="register_college_pincode" aria-describedby="register_college_pincode" placeholder="Enter Pincode" value="">
                  	</div>

	                  <div class="form-group col-sm-6">
	                    <label>Address <span class="span_star">(*)</span></label>
	                    <textarea class="form-control" name="register_college_address" id="register_college_address" rows="2"></textarea>
	                  </div>

	                  	<div class="form-group col-sm-12">
	                      <label>Contact Person Name <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_college_contact_name" name="register_college_contact_name" aria-describedby="register_college_name" placeholder="Enter Contact Person Name" value="">
	                  	</div>
	                  	<div class="form-group col-sm-6">
	                      <label>Contact Person Email <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_college_contact_email" name="register_college_contact_email" placeholder="Enter Contact Person Official Email" value="">
	                  	</div>
	                  	<div class="form-group col-sm-6">
	                      <label>Contact Person Phone no (without country code) <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_college_contact_phone_no" name="register_college_contact_phone_no" aria-describedby="register_college_phone_no" placeholder="Enter Contact Person Official Phone No." value="">
	                  	</div>


	                  	<div class="form-group col-sm-4">
	                      <label>Choose Username <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_college_username" name="register_college_username" placeholder="Choose an Username" value="" >
	                  	</div>
	                  	<div class="form-group col-sm-4">
	                      <label>Password <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_college_password" name="register_college_password" aria-describedby="register_college_phone_no" placeholder="Password" value="">
	                  	</div>

	                  	<div class="form-group col-sm-4">
	                      <label>Confirm Password <span class="span_star">(*)</span></label>
	                      <input type="text" class="form-control" id="register_conf_password" name="register_conf_password" aria-describedby="register_college_phone_no" placeholder="Re-Enter Password" value="">
	                  	</div>

	                  	<div class="form-group col-sm-10">
	                  		<input type="checkbox" id="agree_to_tc" name="agree_to_tc" value="1">
	                      	<label>I agree to <a href="<?php echo base_url();?>terms-conditions" target="_blank">Terms & Conditions.</a></label>
	                  	</div>

	                  <div class="form-group col-sm-2 pull-right">
	                     <button type="submit" class="btn btn-primary" id="btn_update_account" disabled="true" style="float:right;">Register</button>
	                  </div>


	              </div>
	            </form>
	        	</div>
	        </div>
	    </div>
    </div>
  </div>
</div>

<?php $this->widget->run('front_subscription_section',TRUE);?>

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