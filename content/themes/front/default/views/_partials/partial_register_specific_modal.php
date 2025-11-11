<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="modal fade logRegModal reg2ApplyModal" id="reg2ApplyModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="reg2ApplyModal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
      <div class="logSignSec">
        <div class="head d-flex align-items-center justify-content-between">
          <div class="media">
            <img src="<?php echo $popup_data['popup_logo'];?>" width="40" class="mr-3" alt="...">
            <div class="media-body">
              <h6 class="mt-0 mb-0">Register now to apply</h6>
              <?php echo $popup_data['popup_name'];?>
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
                <h6>How Sikshapedia helps you in admission?</h6>
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

                  <!-- <div id="sayCarousol" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                      <div class="carousel-item active">
                        <div class="media sayMedia">
                          <div class="imgBox mr-3"><img src="assets/img/avatar.jpg" width="50" height="50" alt="..."></div>
                          <div class="media-body">
                            <p class="mb-1"></p>
                            <h6 class="m-0 text-bold">Register now to apply</h6>
                          </div>
                        </div>
                      </div>
                      <div class="carousel-item">
                        <div class="media sayMedia">
                          <div class="imgBox mr-3"><img src="assets/img/avatar.jpg" width="50" height="50" alt="..."></div>
                          <div class="media-body">
                            <p class="mb-1"></p>
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
                  </div> -->
                  
                  
                </div>
                
              </div>  
            </div>
            <div class="secRight ">
              <div class="secInner ">
                
                <h4 class="mb-4">Log Into Your Account</h4>
                <form>
                  <div class="row">
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Frist Name</label>
                              <input type="text" placeholder="" class="form-control">
                          </div>
                      </div>
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Email</label>
                              <input type="text" placeholder="email@example.com" class="form-control">
                          </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>Phone no</label>
                            <input type="text" placeholder="" class="form-control">
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>Select a course</label>
                            <select class="form-control">
                              <option>Course-1</option>
                              <option>Course-2</option>
                              <option>Course-3</option>
                              <option>Course-4</option>
                            </select>
                        </div>
                      </div>
                      <div class="col-sm-6">
                          <div class="form-group">
                              <label>Password</label>
                              <input type="password" placeholder="7+ characters" class="form-control">
                          </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" placeholder="Confirm Password" class="form-control">
                        </div>
                      </div>
                      <div class="col-sm-12">
                          <div class="form-group form-check">
                              <input type="checkbox" class="form-check-input" id="exampleCheck1">
                              <label class="form-check-label" for="exampleCheck1">Creating an account means you’re okay with our <a href="" >Terms of Service</a>, 
                                  <a href="" >Privacy Policy</a>, and our default  <a href="">Notification Settings</a>.</label>
                            </div>
                      </div>
                  </div>
                  <p>Already a member <a href="#logModal" data-toggle="modal" data-dismiss="modal" class=""> Login in</a></p>
                  <div class="d-flex justify-content-between">
                      <button class="btn-temp ">Create Account</button>
                  </div>
                </form>
              </div>  
            </div> 
        </div>
      </div>
    </div>
  </div>
</div>