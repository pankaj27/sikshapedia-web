<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="headerBnrSec overlayBnr">
  <img src="https://static.waytoadmissions.com/data/banner_image.png" class="headerBnrImg" alt="">
  <div class="wrapper">
    <div class="headerBnrPanel">
      <div class="bnrThumbBox">
        <div class="bnrThumb shadow bg-white"><img src="<https://static.waytoadmissions.com/data/logo.png" alt=""></div>
        <div class="bnrThumbCon pt-2">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-0 bg-none mb-1">
              <li class="breadcrumb-item ">
                      <a href="https://waytoadmissions.com/">HOME</a>
                    </li>
                <li class="breadcrumb-item ">
                      <a href="https://waytoadmissions.com/in/colleges/west-bengal/salbari">SALBARI</a>
                    </li>
            </ol>
          </nav>
          <h5 class="m-0 bnrTitle text-truncate text-uppercase w-75">SILIGURI INSTITUTE OF TECHNOLOGY,SALBARI</h5>
          <div class="m-0  d-lg-flex  justify-content-between tagLists w-75">
              <div class="text-truncate tags">
                <span><i class="fas fa-map-marker-alt"></i> SALBARI,WEST BENGAL </span>

                                  <span><i class="fas fa-bookmark"> </i> AICTE </span> 
                  
                <span><i class="fas fa-thumbtack"></i> ESTD 1999 </span> 
                                  <span><i class="fas fa-flag"></i> MAULANA ABUL KALAM AZAD UNIVERSITY OF TECHNOLOGY,KOLKATA</span>
                  
                
                
                <span><i class="fas fa-star"> </i> PRIVATE COLLEGE </span> 
                <!-- <span><i class="fas fa-tags"> </i>  10 QUESTIONS </span> 
                <span><i class="fas fa-tags"> </i>  ANSWERED </span> 
                <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
                <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
                <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
                <span><i class="fas fa-tags"> </i>  RANKED 2 </span> --> 
              </div>
              <div class="pl-2"><a href="">  MORE </a></div> 
            </div>
        </div>

      </div>
      <div class="headerBnrCon d-none d-md-block">
        <div class="ratingBox ">
            <div class="points">9.2</div>
            <div class="reviewStars">
              <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></div>
              <div class="reviewCounts">17 REVIEWS</div>
            </div>
        </div>
        <button type="button" class="btn btn-outline-light btnContact apply" style="cursor: pointer !important;">Change Banner</button>
       

        <a href="<?php echo $college_data['college_claim_url'];?>" class="btn btn-link text-white"> <i class="fas fa-dot-circle text-warning pals" ></i>  Claim This College</a>

        <button type="button" class="btnFavorite active"></button>

      </div>
     
    </div>
  </div>
</section>

<section class="tabSliderSec">
  <div class="swiper-container tabSlider navTabSlider swiper-container-initialized swiper-container-horizontal swiper-container-free-mode">
    <div class="swiper-wrapper">
      <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal" class="swiper-slide navLink active swiper-slide-visible swiper-slide-active"> Info </a>
      <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal/courses-fees" class="swiper-slide navLink swiper-slide-visible swiper-slide-next"> Courses &amp; Fees </a>
      <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal/admission-2021" class="swiper-slide navLink swiper-slide-visible"> Admission 2021 </a>
                  <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal/cutoff" class="swiper-slide navLink swiper-slide-visible"> Cutoff </a>
                  <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal/placement" class="swiper-slide navLink swiper-slide-visible"> Placement </a>
                  <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal/scholarship" class="swiper-slide navLink swiper-slide-visible"> Scholarship </a>
                  <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal/faculty" class="swiper-slide navLink"> Faculty </a>
                  <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal/gallery" class="swiper-slide navLink"> Gallery </a>
                  <a href="https://waytoadmissions.com/in/siliguri-institute-of-technology-salbari-west-bengal/hostel" class="swiper-slide navLink"> Hostel </a>
               </div>
    <div class="swiper-button-next swiper-button-white" tabindex="0" role="button" aria-label="Next slide" aria-disabled="false"></div>
    <div class="swiper-button-prev swiper-button-white swiper-button-disabled" tabindex="-1" role="button" aria-label="Previous slide" aria-disabled="true"></div>
  <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
</section>

  <section class="pageDetailsSec py-4">
      <div class="wrapper">
        <div class="row">
          <div class="col-lg-2 mb-4 mb-lg-0">
            <?php $this->widget->run('front_user_menu',$show_user_menu_widget);?>
          </div>
          <div class="col-lg-10 mb-4 mb-lg-0">
            <div class="card userCard">
            <div class="card-header bg-white">
              <h5 class="m-0 d-inline">Register with <?php echo $system_name_title;?></h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12" id="register_msg" style="display:none;">
                  
                </div>
              </div>

              <form id="form_student_verify_otp" novalidate="novalidate" style="display:none;">
                <div class="row">
                  <div class="form-group col-sm-6">
                    <label>Phone no</label>
                    <input type="text" class="form-control" id="register_student_phone_no" name="register_student_phone_no" aria-describedby="register_student_phone_no" placeholder="Enter Official Phone No." value="" disabled="true">
                  </div>
                  <div class="form-group col-sm-6">
                    <label>Email</label>
                    <input type="text" class="form-control" id="register_student_email" name="register_student_email" aria-describedby="register_student_email" placeholder="Enter Official Email." value="" disabled="true">
                  </div>
                </div>
                <div class="row">
                  <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">
                  <div class="form-group col-sm-6">
                    <label>Verify phone number.:<span class="span_star">(*)</span></label>                    
                    <div class="input-group mb-3">
                      <input type="text" class="form-control" id="register_ph_otp" name="register_ph_otp" aria-describedby="register_ph_otp" placeholder="6 digit OTP" value="">
                      <div class="input-group-append">
                        <button class="btn btn-primary"  type="button" id="btn_otp_resend" style="display:none;">Resend OTP</button>
                      </div>
                    </div>
                    <label id="register_ph_otp-error" class="error" for="register_ph_otp" style="display:none;"></label>
                  </div>
                  <div class="form-group col-sm-6">
                    <label>Verify email:<span class="span_star">(*)</span></label>
                    <div class="input-group mb-3">
                      <input type="text" class="form-control" id="register_email_otp" name="register_email_otp" aria-describedby="register_email_otp" placeholder="6 digit OTP" value="">
                    </div>
                    <label id="register_email_otp-error" class="error" for="register_email_otp" style="display:none;"></label>
                  </div>
                </div>
                <div class="row">                 
                  <div class="form-group col-sm-6">
                    <button type="submit" class="btn btn-primary pull-right" id="btn_verify_otp">Verify</button>
                  </div>
                  <div class="form-group col-sm-6">
                    <label id="timer" style="display:none;"></label>
                    <span id="attempts_left"></span>
                  </div>
                </div>
              </form>

              <form id="form_student_register" novalidate="novalidate">
                <div class="row">
                  <!-- <input type="hidden" name="data_type" value="general_settings"> -->
                  <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">

                    <div class="form-group col-sm-4">
                      <label>Name <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_student_name" name="register_student_name" aria-describedby="register_student_name" placeholder="Enter Name" value="">
                    </div>
                    <div class="form-group col-sm-4">
                      <label>Email <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_student_email" name="register_student_email" placeholder="Enter Email" value="">
                    </div>
                    <div class="form-group col-sm-4">
                      <label>Phone no <span class="span_star">(*)</span></label>
                      <input type="text" class="form-control" id="register_student_phone_no" name="register_student_phone_no" aria-describedby="register_college_phone_no" placeholder="Enter Phone No." value="" min="10" max="10">
                    </div>

                    <div class="form-group col-sm-6">
                      <label for="inputState">Country <span class="span_star">(*)</span></label>
                      <select class="form-control chosen-select" name="register_student_country" id="register_student_country">
                        <option value="0">Select Country</option>
                        <?php
                          if(!empty($countries)){
                            foreach ($countries as $key => $value) {
                              ?>
                              <option value="<?php echo $value['country_id'];?>"><?php echo $value['country_name'];?></option>
                              <?php
                            }
                          }
                        ?>
                      </select>
                    </div>

                    <div class="form-group col-sm-6">
                      <label for="inputState">State/Province <span class="span_star">(*)</span></label>
                      <select class="form-control chosen-select" name="register_student_state" id="register_student_state">
                        <option value="0">Select State/Province</option>
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

                    <div class="form-group col-sm-4">
                      <label for="inputState">City/Town <span class="span_star">(*)</span></label>
                      <select class="form-control chosen-select" name="register_student_city" id="register_student_city">
                        <option value="0">Select City/Town</option>
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

                    <div class="form-group col-sm-8">
                      <label for="inputState">Course Interestd In</label>
                        <select class="form-control chosen-select" name="register_student_course" id="register_student_course">
                          <option value="0">Select Course</option>
                          <?php
                            if(!empty($courses)){
                              foreach ($courses as $key => $value) {
                                ?>
                                <option value="<?php echo $value['course_id'];?>"><?php echo $value['course_name'];?></option>
                                <?php
                              }
                            }
                          ?>
                        </select>
                    </div>

                      <div class="form-group col-sm-4">
                        <label>Choose Username <span class="span_star">(*)</span></label>
                        <input type="text" class="form-control" id="register_student_username" name="register_student_username" placeholder="Choose an Username" value="" >
                      </div>
                      <div class="form-group col-sm-4">
                        <label>Password <span class="span_star">(*)</span></label>
                        <input type="text" class="form-control" id="register_student_password" name="register_student_password" aria-describedby="register_college_phone_no" placeholder="Password" value="">
                      </div>

                      <div class="form-group col-sm-4">
                        <label>Confirm Password <span class="span_star">(*)</span></label>
                        <input type="text" class="form-control" id="register_conf_password" name="register_conf_password" aria-describedby="register_college_phone_no" placeholder="Re-Enter Password" value="">
                      </div>

                      <div class="form-group col-sm-10">
                        <input type="checkbox" id="agree_to_tc" name="agree_to_tc" value="1">
                          <label>I agree to <a href="<?php echo base_url();?>terms-conditions" target="_blank">Terms & Conditions.</a></label>
                      </div>

                    <div class="form-group col-sm-2">
                       <button type="submit" class="btn btn-primary pull-right" id="btn_update_account" disabled="true">Register</button>
                    </div>


                </div>
              </form>
            </div>
          </div>

          </div>
        </div>
    </div> 
  </section>

  <style type="text/css">
    /*------scroll bar---------------------*/

    ::-webkit-scrollbar {
      width: 5px;
      height: 7px;
    }
    ::-webkit-scrollbar-button {
      width: 0px;
      height: 0px;
    }
    ::-webkit-scrollbar-thumb {
      background: #525965;
      border: 0px none #ffffff;
      border-radius: 0px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #525965;
    }
    ::-webkit-scrollbar-thumb:active {
      background: #525965;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
      border: 0px none #ffffff;
      border-radius: 50px;
    }
    ::-webkit-scrollbar-track:hover {
      background: transparent;
    }
    ::-webkit-scrollbar-track:active {
      background: transparent;
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
  </style>