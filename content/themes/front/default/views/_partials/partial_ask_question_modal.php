<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="modal fade logRegModal reg2ApplyModal" id="regAskAquestionModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
      <div class="logSignSec">
        <div class="head d-flex align-items-center justify-content-between">
          <div class="media">
            <img src="" width="40" class="mr-3 img_logo" alt="...">
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
                <div class="saySec">
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
                  
                  
                </div>
                
              </div>  
            </div>
            <div class="secRight ">
              <div class="secInner ">
                <hr>
                <form id="form_ask_question" autocomplete="off">
                  <div class="row">
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Full Name</label>
                              <input type="text" placeholder="Full Name" class="form-control" name="query_user_full_name" id="query_user_full_name">
                          </div>
                      </div>
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Email</label>
                              <input type="text" placeholder="Email Address" class="form-control" name="query_user_email" id="query_user_email">
                          </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label id="ph_code">Phone no</label>
                            <input type="text" placeholder="" class="form-control" name="query_user_ph" id="query_user_ph">                            
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>City you live in</label>
                            <select class="chosen-select" name="query_city" id="query_city" data-placeholder="City you live in">
                            </select>
                        </div>
                      </div>

                      <div class="col-sm-6">
                          <div class="form-group">
                            <label>Course interested in</label>
                            <select class="chosen-select" name="query_course" id="query_course" data-placeholder="Course interested in">
                            </select>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                          <label>Looking For Distance Course?</label>
                          <select class="chosen-select" name="query_distance_course" id="query_distance_course" data-placeholder="No">
                            <option value="2">No</option>
                            <option value="1">Yes</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-sm-12">
                        <div class="form-group">
                          <label>Write A Meessage</label>
                          <textarea class="form-control" rows="3" placeholder="Maximum 300 charachters" name="query_message"></textarea>
                        </div>
                      </div>
                    </div>
                 
                    <div class="row">
                      
                      <div class="col-sm-12">
                          <div class="form-group form-check">
                              <label class="form-check-label" for="exampleCheck1">By submitting this form, you accept and agree to our <a href="">Terms of Use.</a></label>
                            </div>
                      </div>
                  </div>
                  <div class="d-flex justify-content-between">
                      <button type="submit" class="btn-temp " id="btn_submit_query">Submit</button>
                  </div>
                </form>
              </div>  
            </div> 
        </div>
      </div>
    </div>
  </div>
</div>