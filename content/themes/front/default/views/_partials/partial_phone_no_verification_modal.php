<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="modal fade logRegModal" id="regModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
      <div class="logSignSec">
        <div class="head d-flex align-items-center justify-content-between">
          <a href="#" class="logoBrand"><img src="<?php echo $system_logo;?>" width="100" alt="<?php echo $system_name;?>"></a>
          <ul class="nav flex-row">
              <li class="nav-item  d-none d-sm-inline">
                <span class="nav-link"></span>
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

              <div class="secInner " id="otp_div">
                <h4 class="mb-4">Verify Your Account with Phone No.</h4>
                <div class="d-flex justify-content-between mb-4" id="div_msg">
                </div>
                <h6 class="orTitle mb-3"></h6>
                <form id="form_register_otp_veify" autocomplete="off">
                  <input type="hidden" name="registration_user" id="registration_user" value="<?php echo encode_data($userdata->user_id);?>">
                  <div class="row">
                    <div class="col-sm-12">
                          <div class="form-group">
                              <label id="otp_label">OTP (6 digit phone no has been sent to your registered phone no <?php echo $userdata->user_phone_no;?>)</label>
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

<script type="text/javascript">var page='';</script>