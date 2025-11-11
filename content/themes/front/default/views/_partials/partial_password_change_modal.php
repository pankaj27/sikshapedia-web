<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="modal fade logRegModal" id="passModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="passModal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
      <div class="logSignSec">
        <div class="head d-flex align-items-center justify-content-between">
          <a href="#" class="logoBrand"><img src="<?php echo $system_logo;?>" width="100" alt="<?php echo $system_name;?>"></a>
          <ul class="nav flex-row">
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
                <h6>How Way2Admission helps you?</h6>
                <div class="futureBox mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">View College Brochures</h6>
                      <a href="#">Brochures Details </a>
                  </div>
                </div>
                <div class="futureBox mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">View College Brochures</h6>
                      <a href="#">Brochures Details </a>
                  </div>
                </div>
                <div class="futureBox  mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">View College Brochures</h6>
                      <a href="#">Brochures Details </a>
                  </div>
                </div>
                <div class="futureBox  mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">View College Brochures</h6>
                      <a href="#">Brochures Details </a>
                  </div>
                </div>
                <div class="futureBox  mb-2">
                  <div class="future-icon"><i class="fa fa-globe"></i></div>
                  <div class="future-content">
                      <h6 class="text-white">View College Brochures</h6>
                      <a href="#">Brochures Details </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="secRight">
              <div class="secInner ">
                <h4 class="mb-4">Change Account Credentials</h4>
                <h6 class="orTitle mb-3"></h6>
                <form id="form_password">
                  <input type="hidden" value="<?php echo encode_data('password_change');?>" name="change_type">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label>Current Password</label>
                                <input type="password" placeholder="Current Password" class="form-control" id="user_current_password" name="user_current_password">
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" placeholder="7+ characters" class="form-control" id="user_new_password" name="user_new_password">
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label>Confirm Password</label>
                                <input type="password" placeholder="7+ characters" class="form-control" name="user_conf_password">
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn-temp" type="submit" id="btn_update_password">Update Password</button>
                    </div>
                </form>
              </div>
            </div> 
        </div>
      </div>
    </div>
  </div>
</div>