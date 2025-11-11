<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="modal fade logRegModal" id="regModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="regModal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
      <div class="logSignSec">
        <div class="head d-flex align-items-center justify-content-between">
          <a href="#" class="logoBrand"><img src="<?php echo $system_logo;?>" width="100" alt="<?php echo $system_name;?>"></a>
          <ul class="nav flex-row">
              <li class="nav-item  d-none d-sm-inline">
                <span class="nav-link">Already a member?<a href="#logModal" data-toggle="modal" data-dismiss="modal">  Sign in</a></span>
              </li>
              <li class="nav-item ">
                <button class="nav-link btn" href="#" data-dismiss="modal" aria-label="Close"><span class="fas fa-times"></span></button>
              </li>
          </ul>
        </div>
        <div class="logSignContent">
            <div class="secLeft ">
              <div class="secInner ">
                <h2>Welcome Back,</h2>
                <span class="d-sm-none">Already a member <a href="#logModal" data-toggle="modal" data-dismiss="modal" class="text-white"> Login in</a></span>
                <h6>How WayToAdmissions helps you?</h6>
                <div class="futureBox mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">View College Brochures</h6>
                      <a href="javascript:void(0);">Brochures Details </a>
                  </div>
                </div>
                <div class="futureBox mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">Shortlist and Apply to colleges</h6>
                      <a href="javascript:void(0);">List your preferable colleges </a>
                  </div>
                </div>
                <div class="futureBox  mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">Ask Questions to senior Counselors</h6>
                      <a href="javascript:void(0);">Clear all your doubts </a>
                  </div>
                </div>
                <div class="futureBox  mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">Never miss Important deadlines</h6>
                      <a href="javascript:void(0);">Keep notified always </a>
                  </div>
                </div>
              </div>  
            </div>
            <div class="secRight ">
              <div class="secInner " id="reg_dev">
                <!-- <div class="media mb-3">
                  <img src="<?php echo $system_logo_small;?>" width="40" class="mr-3" alt="...">
                  <div class="media-body">
                    <h6 class="mt-0 mb-0">Register now </h6>
                    Cras sit amet nibh libero.
                  </div>
                </div> -->
                <h4 class="mb-4">Register Your Account with</h4>
                <!-- <div class="d-flex justify-content-between mb-4" id="div_msg">
                    <button class="btn-temp btn_social" data-social_id="gauth" id="btn_gauthr"><i class="fab fa-google"></i> <span class="d-none d-sm-inline"> Google </span></button>
                    <button class="btn-temp"><i class="fab fa-facebook"></i><span class="d-none d-sm-inline"> Facebook</span> </button>
                    <button class="btn-temp"><i class="fab fa-apple"></i> <span class="d-none d-sm-inline"> Apple </span></button>
                </div>
                <h6 class="orTitle mb-3"></h6> -->
                <form id="form_register" autocomplete="off">
                  <!-- <input type="hidden" name="user_curl" id="user_curl" value=""> -->
                  <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
                  <input type="hidden" name="registration_from" id="registration_from" value="normal">
                  <div class="row">
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>Country</label>
                            <select class="form-control chosen-select" name="register_country" id="register_country">
                              <option value="">Select Country</option>
                            </select>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>State</label>
                            <select class="form-control chosen-select" name="register_state" id="register_state">
                              <option value="">Select State</option>
                            </select>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>City</label>
                            <select class="form-control chosen-select" name="register_city" id="register_city">
                              <option value="">Select City</option>
                            </select>
                        </div>
                      </div>
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Name</label>
                              <input type="text" placeholder="Name" class="form-control" name="registration_name" id="registration_name" autocomplete="off">
                          </div>
                      </div>
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Email</label>
                              <input type="text" placeholder="Email" class="form-control" name="registration_email" id="registration_email">
                          </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label id="label_ph">Phone No (+91)</label>
                            <input type="text" placeholder="Phone No." class="form-control" name="registration_phone_no" id="registration_phone_no">
                        </div>
                      </div>                      
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Password</label>
                              <input type="password" placeholder="7+ characters" class="form-control" name="registration_password" id="registration_password">
                          </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" placeholder="Confirm Password" class="form-control" name="registration_conf_password">
                        </div>
                      </div>
                  </div>
                  <div class="d-flex justify-content-between">
                      <button type="submit" class="btn-temp" id="btn_create_account">Create Account</button>
                  </div>
                </form>
              </div>

              <div class="secInner " id="otp_div" style="display:none;">
                <!-- <div class="media mb-3">
                  <img src="<?php echo $system_logo_small;?>" width="40" class="mr-3" alt="...">
                  <div class="media-body">
                    <h6 class="mt-0 mb-0">Register now </h6>
                    Cras sit amet nibh libero.
                  </div>
                </div> -->
                <h4 class="mb-4">Verify Your Account with Phone No.</h4>
                <div class="d-flex justify-content-between mb-4" id="div_msg">
                    <!-- <button class="btn-temp btn_social" data-social_id="gauth" id="btn_gauthr"><i class="fab fa-google"></i> <span class="d-none d-sm-inline"> Google </span></button> -->
                    <!-- <button class="btn-temp"><i class="fab fa-facebook"></i><span class="d-none d-sm-inline"> Facebook</span> </button>
                    <button class="btn-temp"><i class="fab fa-apple"></i> <span class="d-none d-sm-inline"> Apple </span></button> -->
                </div>
                <h6 class="orTitle mb-3"></h6>
                <form id="form_register_otp" autocomplete="off">
                  <input type="hidden" name="registration_user" id="registration_user">
                  <div class="row">
                    <div class="col-sm-8">
                          <div class="form-group">
                              <label id="otp_label">OTP</label>
                              <input type="text" placeholder="OTP" class="form-control" name="registration_otp" id="registration_otp" autocomplete="off">
                          </div>
                      </div>
                  </div>
                  <div class="d-flex justify-content-between">
                      <button type="submit" class="btn-temp" id="btn_create_account_verify">Verify Phone No</button>
                  </div>
                </form>
              </div>   
            </div> 
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/javascript">var page='';var _vtype='';var ads_image='';</script>


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
    max-height: 100px;
  }

  .active-result .group-option .highlighted{
    background-color: #1b1f4c !important;
  }
</style>