<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="modal fade logRegModal reg2ApplyModal" id="reg4ApplyModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
      <div class="logSignSec">
        <div class="head d-flex align-items-center justify-content-between">
          <div class="media">
            <img src="<?php echo $system_logo_small;?>" width="40" class="mr-3 img_logo" alt="...">
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
                  <h5>What people say</h5>

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
              <div class="secInner ">
                <hr>
                <form id="form_apply_for_job" autocomplete="off">
                  <input type="hidden" name="applicant_type" id="applicant_type" value="">
                  <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
                  <div class="row">
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Full Name</label>
                              <input type="text" placeholder="Full Name" class="form-control" name="applicant_full_name" id="applicant_full_name">
                          </div>
                      </div>
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Email</label>
                              <input type="text" placeholder="Email Address" class="form-control" name="applicant_email" id="applicant_email">
                          </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label id="ph_code">Phone no (+91)</label>
                            <input type="text" placeholder="Enter phone no" class="form-control" name="applicant_ph" id="applicant_ph">                            
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label id="ph_code">Passport SIze Photo (,jpg/.jpeg/.png allowed)</label>
                            <input type="file" class="form-control" name="applicant_photo" id="applicant_photo">                           
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label id="ph_code">CV (.doc/.docx file allowed)</label>
                            <input type="file" class="form-control" name="applicant_cv" id="applicant_cv">                           
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>State you live in</label>
                            <select class="form-control" name="applicant_state" id="applicant_state" data-placeholder="State you live in">
                              <option value="0">Select state</option>
                              <?php
                              foreach ($country_states as $key => $value) {
                                ?>
                                <option value="<?php echo $value['state_id'];?>"><?php echo $value['state_name'];?></option>
                                <?php
                              }
                              ?>
                            </select>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label id="ph_code">Pincode</label>
                            <input type="text" placeholder="Enter pincode" class="form-control" name="applicant_pincode" id="applicant_pincode">                           
                        </div>
                      </div>
                      
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label id="ph_code">Address</label>
                            <textarea class="form-control" rows="3" name="applicant_address" id="applicant_address"></textarea>                            
                        </div>
                      </div>
                    </div>
                    
                 
                    <!-- <div class="row">
                      
                      <div class="col-sm-12">
                          <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" name="" id="exampleCheck1">
                              <label class="form-check-label" for="exampleCheck1">Creating an account means you’re okay with our <a href="" >Terms of Service</a>, 
                                  <a href="" >Privacy Policy</a>, and our default  <a href="">Notification Settings</a>.</label>
                            </div>
                      </div>
                  </div> -->
                  <div class="d-flex justify-content-between">
                      <button type="submit" class="btn-temp " id="btn_submit_job_application">Submit</button>
                  </div>
                </form>
              </div>  
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
    max-height: 150px;
  }

 .chosen-container .chosen-results {
    max-height: 100px;
  }

  .active-result .group-option .highlighted{
    background-color: #1b1f4c !important;
  }
</style>