<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

  <div class="examSearchWrapper">
    

    <section class="commonSec pt-3 pb-4">
      <div class="profile-content py-4">
        <div class="wrapper">
          <div class="row">
            <div class="col-lg-9 mb-4 mb-lg-0" id="general_tabs">
              <div class="card userCard">
                <div class="card-header bg-white">
                  <h5 class="m-0 d-inline">Register with us</h5> <small id="user_type" class="form-text text-muted"></small>
                </div>
                <div class="card-body">
                  <form id="form_consultant_register">
                    <input type="hidden" name="<?php echo $csrf['name'];?>" id="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
                    <div class="row">               
                        <div class="form-group col-sm-6">
                            <label>Courses</label>
                            <select class="form-control" name="register_course" id="register_course" <?php echo ($userdata->user_role>0)?'disabled':'';?>>
                              <option value="">Select Course</option>
                            </select>
                        </div>
                        <div class="form-group col-sm-6">
                            <label>Name</label>
                            <input type="text" class="form-control" id="registration_name" name="registration_name" aria-describedby="registration_name" placeholder="Enter Name" value="">
                        </div>
                        <div class="form-group col-sm-6">
                            <label>Contact Person Name</label>
                            <input type="text" class="form-control" id="registration_contact_person_name" name="registration_contact_person_name" placeholder="Enter Contact person Name" value="">
                        </div>
                        <div class="form-group col-sm-6">
                            <label>Consultancy Email</label>
                            <input type="text" class="form-control" id="registration_email" name="registration_email" placeholder="Enter Email" value="">
                        </div>
                        <div class="form-group col-sm-6">
                            <label>Consultancy Phone no</label>
                            <input type="text" class="form-control" id="registration_phone_no" name="registration_phone_no" aria-describedby="registration_phone_no" placeholder="Enter Phone No." value="">
                        </div>
                        
                        <div class="form-group col-sm-6">
                            <label>Contact Person Phone no</label>
                            <input type="text" class="form-control" id="registration_contact_person_phone_no" name="registration_contact_person_phone_no" aria-describedby="registration_contact_person_phone_no" placeholder="Enter Phone No." value="">
                        </div>

                        <div class="form-group col-sm-6">
                          <label for="inputState">State</label>
                          <select class="form-control" name="registration_state" id="registration_state">
                            <option value="">Select State</option>
                            <?php
                            if(isset($states) && !empty($states)){
                              foreach ($states as $key => $value) {
                                ?>
                                <option value="<?php echo $value['state_id'];?>"><?php echo $value['state_name'];?></option>
                                <?php
                              }
                            }
                            ?>
                          </select>
                        </div>


                        <div class="form-group col-sm-6">
                          <label for="inputState">City/Town</label>
                          <select class="form-control" name="registration_city" id="registration_city">
                            <option value="">Select City/Town</option>
                            
                            
                          </select>
                        </div>


                        <div class="form-group col-sm-6">
                            <label>Pincode</label>
                            <input type="text" class="form-control" id="registration_pincode" name="registration_pincode" aria-describedby="registration_pincode" placeholder="Enter Pincode" value="">
                        </div>

                       
                          
                        

                        <div class="form-group col-sm-6">
                            <label>Address</label>
                            <textarea class="form-control" name="registration_address" id="registration_address" rows="5"></textarea>
                        </div>



                        <div class="col-sm-12">
                           <button type="submit" class="btn btn-primary" id="btn_consultant_account">Register</button>
                        </div>


                    </div>
                  </form>

                  <form id="form_account_otp_verification" style="display:none;">
                    <input type="hidden" name="<?php echo $csrf['name'];?>" id="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
                    <input type="hidden" class="form-control" id="registration_phone_no" name="registration_phone_no" aria-describedby="registration_phone_no" value="">
                    <div class="form-group col-sm-6">
                        <label>OTP</label>
                        <div class="input-group mb-3">
                          <input type="text" class="form-control" id="registration_otp" name="registration_otp" aria-describedby="registration_otp" placeholder="6 digit OTP" value="">
                        </div>
                    </div>
                    <div class="col-sm-12">
                       <button type="submit" class="btn btn-primary" id="btn_consultant_account_verify">Verify</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



<script type="text/javascript">var page='';</script>
    </section>
    
 </div><!-- //examSearchWrapper -->


 <style type="text/css">
  .chosen-container{
    z-index: 1800000;
  }
 .chosen-container-single{
    width: 100% !important;
    border-radius: 0px !important;
  }
  .chosen-drop{
    max-height: 150px;
  }

 .chosen-container .chosen-results {
    max-height: 111px !important;
  }

  .active-result .group-option .highlighted{
    background-color: #1b1f4c !important;
  }
</style>
