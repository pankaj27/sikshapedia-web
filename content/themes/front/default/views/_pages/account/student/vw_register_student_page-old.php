<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="profile-content py-4 bg-white" style="padding-bottom:20px;">

  <div class="wrapper">
    <div class="row">
    	<div class="col-lg-8 mb-4 mb-lg-0">
        <div class="card userCard">
          <div class="card-header bg-white">
            <h5 class="m-0 d-inline">Why Sign Up? </h5>
          </div>
          <div class="card-body">
        		<div class="card featureReviewCard">
                <div class="card-body d-flex">
                    <div class="cardContent">
                        <i class="fas fa-check-circle color-orange"></i> Browse college brochures
                    </div>
                </div>
            </div>
            <br>
            <div class="card featureReviewCard">
                <div class="card-body d-flex">
                    <div class="cardContent">
                         <i class="fas fa-check-circle color-orange"></i> View Detailed Fees
                    </div>
                </div>
            </div>
            <br>
            <div class="card featureReviewCard">
                <div class="card-body d-flex">
                    <div class="cardContent">
                        <i class="fas fa-check-circle color-orange"></i> Identify Potential Clleges and Submit Applications
                    </div>
                </div>
            </div>
            <br>
            <div class="card featureReviewCard">
                <div class="card-body d-flex">
                    <div class="cardContent">
                        <i class="fas fa-check-circle color-orange"></i> Ask Questions to senior Counselors
                    </div>
                </div>
            </div>
            <br>
            <div class="card featureReviewCard">
                <div class="card-body d-flex">
                    <div class="cardContent">
                        <i class="fas fa-check-circle color-orange"></i> Never miss Important deadlines
                    </div>
                </div>
            </div>
          </div>
        </div>

    	</div>
	    <div class="col-lg-4 mb-4 mb-lg-0">
	        <div class="card userCard frm1">
	        	<div class="card-header bg-white">
	        	  <h5 class="m-0 d-inline">Register Now</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
	        	</div>
	        	<div class="card-body">
	        		<div class="row">
	        			<div class="col-lg-12" id="register_msg" style="display:none;">
	        				
	        			</div>
	        		</div>

	        		<form id="form_student_verify_otp2" novalidate="novalidate" style="display:none;">
	        			<!-- <div class="row">
	        				<div class="form-group col-sm-6">
                    <label>Phone no</label>
                    <input type="text" class="form-control" id="register_student_phone_no2" name="register_student_phone_no2" aria-describedby="register_student_phone_no2" placeholder="Enter Official Phone No." value="" disabled="true">
                	</div>
                	<div class="form-group col-sm-6">
                    <label>Email</label>
                    <input type="text" class="form-control" id="register_student_email2" name="register_student_email2" aria-describedby="register_student_email2" placeholder="Enter Official Email." value="" disabled="true">
                	</div>
	        			</div> -->
	        			<div class="row">
	        				<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">
	        				<div class="form-group col-sm-6">
	        					<label>Verify phone number.:<span class="span_star">(*)</span></label>                    
                    <div class="input-group mb-3">
	                    <input type="text" class="form-control" id="register_ph_otp" name="register_ph_otp" aria-describedby="register_ph_otp" placeholder="4 digit OTP" value="">
	                    <div class="input-group-append">
	                      <button class="btn btn-primary"  type="button" id="btn_otp_resend" style="display:none;">Resend OTP</button>
	                    </div>
	                  </div>
	                  <label id="register_ph_otp-error" class="error" for="register_ph_otp" style="display:none;"></label>
	        				</div>
	        				<!-- <div class="form-group col-sm-6">
	        					<label>Verify email:<span class="span_star">(*)</span></label>
                    <div class="input-group mb-3">
	                    <input type="text" class="form-control" id="register_email_otp" name="register_email_otp" aria-describedby="register_email_otp" placeholder="6 digit OTP" value="">
	                  </div>
	                  <label id="register_email_otp-error" class="error" for="register_email_otp" style="display:none;"></label>
	        				</div> -->

	        				<div class="form-group col-sm-6">
	        					<label id="timer" style="display:none;"></label>
	        					<span id="attempts_left"></span>
	        				</div>
	        			</div>
	        			<div class="row">	        				
        					<div class="form-group col-sm-6">
                    <button type="submit" class="btn btn-primary pull-right" id="btn_verify_otp">Verify</button>
                  </div>
                  
                </div>
	        		</form>

	            <form id="form_student_register" novalidate="novalidate">
	            	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">

	              <div class="row">
                	<div class="form-group col-sm-12">
                    <label>Name <span class="span_star">(*)</span></label>
                    <input type="text" class="form-control" id="register_student_name" name="register_student_name" aria-describedby="register_student_name" placeholder="Enter Name" value="">
                	</div>
                </div>

                <div class="row">
              		<div class="form-group col-sm-6">
                    <label for="inputState">Country <span class="span_star">(*)</span></label>
                    <select class="form-control chosen-select" name="register_student_country" id="_register_student_country">
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
                    <label>Phone no <span class="span_star">(*)</span></label>
                    <input type="text" class="form-control" id="register_student_phone_no" name="register_student_phone_no" aria-describedby="register_college_phone_no" placeholder="Enter Phone No." value="">
                	</div>
                </div>
                  	
                <div class="row">
                	<div class="form-group col-sm-12">
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
                </div>

                <div class="row">
                	<div class="form-group col-sm-10">
                		<input type="checkbox" id="agree_to_tc" name="agree_to_tc" value="1">
                    <label>I agree to <a href="<?php echo base_url();?>terms-conditions" target="_blank">Terms & Conditions.</a></label>
                	</div>

                  <div class="form-group col-sm-2 pull-right">
                     <button type="submit" class="btn btn-primary" id="btn_update_account" disabled="true" style="float:right;">Register</button>
                  </div>
                </div>
	            </form>

	        	</div>
            <div class="card-footer">
              <small id="user_type" class="form-text text-muted">Already A Member? <a href="<?php echo base_url();?>signin">Login Here</a></small>
            </div>
	        </div>
	    </div>
			
    </div>

  </div>
</section>

<?php $this->widget->run('front_top_colleges_section',TRUE);?>

<?php $this->widget->run('front_top_study_places',TRUE);?>

<?php $this->widget->run('front_mobile_app_section',TRUE);?>

<?php $this->widget->run('front_subscription_section',TRUE);?>
<script type="text/javascript">var wbpage='';</script>

<style type="text/css">
  .chosen-container{
    z-index: 1800000;
  }
 .chosen-container-single{
    width: 100% !important;
    border-radius: 0px !important;
  }
  .chosen-drop{
    max-height: 150px !important;
  }

 .chosen-container .chosen-results {
    max-height: 100px !important;
  }

  .active-result .group-option .highlighted{
    background-color: #1b1f4c !important;
  }
  .span_star{
  	color: red;
  }
  .error{
  	color: red;
  }
 .frm1 {
    border: 3px solid rgba(0,0,0,.125);
    box-shadow: 7px 10px 10px 0px #ccc;
}
</style>

<script type="text/javascript">var page='';</script>