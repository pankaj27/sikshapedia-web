<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="modal fade logRegModal reg2ApplyModal" id="claiminstituteModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="claiminstituteModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div class="modal-content">
        <div class="logSignSec">
          <div class="head d-flex align-items-center justify-content-between">
            <div class="media">
              <img src="<?php echo $system_logo;?>" width="120" class="mr-3" alt="<?php echo $system_name;?>">
              <div class="media-body">
                
              </div>
            </div>
            <ul class="nav flex-row">
                <li class="nav-item ">
                  <button class="nav-link btn" href="#" data-dismiss="modal" aria-label="Close"><span class="fas fa-times"></span></button>
                </li>
            </ul>
          </div>
          <div class="logSignContent">
              <div class="secLeft ">
                <div class="secInner ">
                  <h6>How Way2Admission helps you in admission?</h6>
                  <div class="row mt-3">
                    <div class="col-6">
                      <a href="#" class="iconLinkBox">
                        <div class="boxIcon"><i class="fa fa-globe"></i></div>
                        <div class="boxContent">View College Brochures</div>
                      </a>
                    </div>
                    <div class="col-6">
                      <a href="#" class="iconLinkBox">
                        <div class="boxIcon"><i class="fa fa-globe"></i></div>
                        <div class="boxContent">View College Brochures</div>
                      </a>
                    </div>
                    <div class="col-6">
                      <a href="#" class="iconLinkBox">
                        <div class="boxIcon"><i class="fa fa-globe"></i></div>
                        <div class="boxContent">View College Brochures</div>
                      </a>
                    </div>
                    <div class="col-6">
                      <a href="#" class="iconLinkBox">
                        <div class="boxIcon"><i class="fa fa-globe"></i></div>
                        <div class="boxContent">View College Brochures</div>
                      </a>
                    </div>
                  </div>
                  <!-- <div class="saySec">
                    <h5>Whate people say</h5>

                    <div id="sayCarousol" class="carousel slide" data-ride="carousel">
                      <div class="carousel-inner">
                        <div class="carousel-item active">
                          <div class="media sayMedia">
                            <div class="imgBox mr-3"><img src="assets/img/avatar.jpg" width="50" height="50" alt="..."></div>
                            <div class="media-body">
                              <p class="mb-1">"Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem."</p>
                              <h6 class="m-0 text-bold">Register now to apply</h6>
                            </div>
                          </div>
                        </div>
                        <div class="carousel-item">
                          <div class="media sayMedia">
                            <div class="imgBox mr-3"><img src="assets/img/avatar.jpg" width="50" height="50" alt="..."></div>
                            <div class="media-body">
                              <p class="mb-1">"Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem."</p>
                              <h6 class="m-0 text-bold">Register now to apply</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a class="carousel-control-prev" href="#sayCarousol" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                      </a>
                      <a class="carousel-control-next" href="#sayCarousol" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                      </a>
                    </div>
                    
                    
                  </div> -->
                  
                </div>  
              </div>
              <div class="secRight ">
                <hr>
                <div class="secInner ">
                  
                  <h4 class="mb-4" id="h4_verify_text">Claim this College</h4>
                  <span id="span_verify_text">You'll receive a 4 digit code in your email address and mobile no. to verify next</span>
                  
                  <form id="form_claim_for_college" autocomplete="off">
                      <input type="hidden" name="claim_institute" id="claim_institute">
                      <input type="hidden" name="claim_institute_type" id="claim_institute_type">
                      <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="Full Name" class="form-control" name="claimer_full_name" id="claimer_full_name">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="text" placeholder="Email Address" class="form-control" name="claimer_email" id="claimer_email">
                            </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="form-group">
                              <label id="ph_code">Phone no</label>
                              <input type="text" placeholder="Phone No." class="form-control" name="claimer_ph" id="claimer_ph">             
                          </div>
                        </div>
                      </div>
                      
                      <div class="d-flex justify-content-between">
                        <button type="submit" class="btn-temp " id="btn_submit_claim">Submit</button>
                      </div>
                  </form>

                  <form id="form_claim_for_college_verify" autocomplete="off" style="display: none;">
                    <div class="error" id="otp_error"></div>
                      <div class="my-5 mx-auto " style="max-width: 200px;">
                        <div class="row form-row">
                          <div class="col"><input type="text" class="form-control claim_otp_value" name="claim_otp_value[]" maxlength="1"></div>
                          <div class="col"><input type="text" class="form-control claim_otp_value" name="claim_otp_value[]" maxlength="1"></div>
                          <div class="col"><input type="text" class="form-control claim_otp_value" name="claim_otp_value[]" maxlength="1"></div>
                          <div class="col"><input type="text" class="form-control claim_otp_value" name="claim_otp_value[]" maxlength="1"></div>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <button type="submit" class="btn-temp " id="btn_submit_claim_verify">Submit</button>
                      </div>
                  </form>
                </div>  
              </div> 
          </div>
        </div>
      </div>
    </div>
  </div>