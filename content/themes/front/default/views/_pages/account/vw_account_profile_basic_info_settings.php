<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="profile-content py-4">
  <div class="wrapper">
    <div class="row">
      <div class="col-lg-12 mb-4 mb-lg-0" id="general_tabs">
        <div class="card userCard">
        	<div class="card-header bg-white">
        	  <h5 class="m-0 d-inline">General Settings</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
        	</div>
        	<div class="card-body">
            <form id="form_general_settings">
              <div class="row">
                <input type="hidden" name="data_type" value="general_settings">
                <input type="hidden" name="registration_from" id="registration_from" value="<?php echo $reg_from;?>">
                <?php
                if(isset($scholarship_msg)){
                  ?>
                  <div class="form-group col-sm-12">
                    <div class="alert alert-info"><?php echo $scholarship_msg;?></div>
                  </div>
                  <?php
                }

                ?>
                  <div class="form-group col-sm-6">
                      <label>Account Type</label>
                      <select class="form-control" name="user_type" id="user_type" <?php echo ($userdata->user_role>0)?'disabled':'';?>>
              					<option value="">Select Account Type</option>
              					<option value="<?php echo encode_data(3);?>" <?php echo ($userdata->user_role==3)?'selected':'';?>>University</option>
              					<option value="<?php echo encode_data(4);?>" <?php echo ($userdata->user_role==4)?'selected':'';?>>College</option>
              					<option value="<?php echo encode_data(8);?>" <?php echo ($userdata->user_role==8)?'selected':'';?>>Student</option>
              				</select>
                  </div>
                  <div class="form-group col-sm-6">
                      <label>Name</label>
                      <input type="text" class="form-control" id="registration_name" name="registration_name" aria-describedby="registration_name" placeholder="Enter Name" value="<?php echo isset($userdata)?$userdata->user_fullname:'';?>">
                  </div>
                  <div class="form-group col-sm-6">
                      <label>Email</label>
                      <input type="text" class="form-control" id="registration_email" name="registration_email" placeholder="Enter Email" value="<?php echo isset($userdata)?$userdata->user_email:'';?>" <?php echo ($userdata->user_role>0)?'disabled':'';?>>
                  </div>
                  <div class="form-group col-sm-6">
                      <label>Phone no</label>
                      <input type="text" class="form-control" id="registration_phone_no" name="registration_phone_no" aria-describedby="registration_phone_no" placeholder="Enter Phone No." value="<?php echo isset($userdata)?$userdata->user_phone_no:'';?>" <?php echo ($userdata->user_role>0)?'disabled':'';?>>
                  </div>
                  <div class="form-group col-sm-6">
                    <label for="inputState">Country</label>
                    <select class="form-control" name="register_country" id="register_country">
                      <option value="">Select Country</option>
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

                  <div class="form-group col-sm-6">
                    <label for="inputState">State</label>
                    <select class="form-control" name="registration_state" id="registration_state">
                      <option value="">Select State</option>
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
                    <select class="form-control" name="registration_district" id="registration_district">
                      <option value="">Select District</option>
                    </select>
                  </div>

                  <div class="form-group col-sm-6">
                    <label for="inputState">City/Town</label>
                    <select class="form-control" name="registration_city" id="registration_city">
                      <option value="">Select City/Town</option>
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


                  <div class="form-group col-sm-6">
                      <label>Pincode</label>
                      <input type="text" class="form-control" id="registration_pincode" name="registration_pincode" aria-describedby="registration_pincode" placeholder="Enter Pincode" value="<?php echo (isset($userdata) && isset($userdata->user_pincode))?$userdata->user_pincode:'';?>">
                  </div>

                  <?php 
                  if($reg_from=='scholarship'){
                    ?>
                    <div class="form-group col-sm-6">
                        <label>OTP</label>
                        <div class="input-group mb-3">
                          <input type="text" class="form-control" id="registration_otp" name="registration_otp" aria-describedby="registration_otp" placeholder="6 digit OTP" value="">
                          <div class="input-group-append">
                            <button class="btn btn-primary" id="btn_send_otp" type="button">Send OTP</button>
                          </div>
                        </div>
                    </div>
                    <?php
                  }

                  ?> 

                  <div class="form-group col-sm-6">
                      <label>Address</label>
                      <textarea class="form-control" name="registration_address" id="registration_address" rows="5"><?php echo (isset($userdata) && isset($userdata->user_address))?$userdata->user_address:'';?></textarea>
                  </div>



                  <div class="col-sm-12">
                     <button type="submit" class="btn btn-primary" id="btn_update_account">Update</button>
                  </div>


              </div>
            </form>
        	</div>
        </div>
      </div>
    </div>
  </div>
</div>

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
</style>

<script type="text/javascript">var page='';</script>