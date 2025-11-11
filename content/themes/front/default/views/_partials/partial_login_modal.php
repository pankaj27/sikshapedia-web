<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="modal fade logRegModal" id="logModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="logModal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
      <div class="logSignSec">
        <div class="head d-flex align-items-center justify-content-between">
          <a href="#" class="logoBrand"><img src="<?php echo $system_logo;?>" width="100" alt="<?php echo $system_name;?>"></a>
          <ul class="nav flex-row">
              <li class="nav-item  d-none d-sm-inline">
                <span class="nav-link">Not a member yet?<a href="#regModal"  data-toggle="modal" data-dismiss="modal" id="sign_up_btns" data-login_from="">  Sign Up</a></span>
              </li>
              <li class="nav-item ">
                <button class="nav-link btn" href="#" data-dismiss="modal" aria-label="Close"><span class="fas fa-times"></span></button>
              </li>
          </ul>
        </div>
        <div class="logSignContent">
            <div class="secLeft">
              <div class="secInner ">
                
                <h2>Welcome Back,</h2>
                <span class="d-sm-none">Not a member yet?<a href="#regModal"  data-toggle="modal" data-dismiss="modal" class="text-white">  Sign Up</a></span>
                <h6>How <?php echo $system_name;?> helps you?</h6>
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
                      <h6 class="text-white">Check Detaild Fees</h6>
                      <a href="javascript:void(0);">Get details about fees </a>
                  </div>
                </div>
                <div class="futureBox  mb-2">
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
            <div class="secRight">
              <div class="secInner">
                <h4 class="mb-4">Log Into Your Account</h4>
                <!-- <div class="d-flex justify-content-between mb-4">
                    <button class="btn-temp btn_social" data-social_id="gauth" id="btn_gauth"><i class="fab fa-google"></i> <span class="d-none d-sm-inline"> Google </span></button>
                    <button class="btn-temp btn_social" data-social_id="fbauth" id="btn_fbauth"><i class="fab fa-facebook"></i><span class="d-none d-sm-inline"> Facebook</span> </button>
                    <button class="btn-temp btn_social" data-social_id="appleauth" id="btn_appleauth"><i class="fab fa-apple"></i> <span class="d-none d-sm-inline"> Apple </span></button>
                </div>
                <h6 class="orTitle mb-3" id="">Or log in using your email address</h6> -->
                <form id="form_login">
                    <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
                    <input type="hidden" name="user_curl" id="user_curl" value="">
                    <input type="hidden" name="login_from" id="login_from" value="normal">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" placeholder="Username" class="form-control" id="user_name" name="user_name">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" placeholder="7+ characters" class="form-control" id="user_password" name="user_password">
                            </div>
                        </div>
                        <!-- <div class="col-sm-12">
                            <div class="form-group form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                                <label class="form-check-label" for="exampleCheck1">Keep meLogged In.</label>
                              </div>
                        </div> -->
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn-temp" type="submit" id="btn_login">Log In</button>
                        <span>Forgot Password? <a href="javascript:void(0);" id="forget_link"> Click Here.</a></span>
                    </div>
                </form>
                <form id="form_forget_pass" style="display:none;">
                    <input type="hidden" name="user_curl" id="user_curl" value="">
                    <input type="hidden" name="login_from" id="login_from" value="normal">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Registered Email</label>
                                <input type="text" placeholder="Registered Email" class="form-control" id="registered_email" name="registered_email">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn-temp" type="submit" id="btn_login">Submit</button>
                    </div>
                </form>
              </div>
            </div> 
        </div>
      </div>
    </div>
  </div>
</div>