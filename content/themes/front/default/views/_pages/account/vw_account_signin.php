<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="profile-content py-4 bg-white">
  <div class="wrapper wrapper-background">
    <div class="row non-mobile-section">
    	<div class="col-lg-6 mb-4 mb-lg-0" style="padding-top: 150px;padding-right: 280px;padding-bottom: 150px;padding-left: 50px;top:-80px">
	        <div class="card userCard">
	          <div class="card-body">
	          	<div class="row" style="padding-bottom:20px;font-weight: bold;">
	          		<div class="col-lg-12">
			          	<h5 class="m-0 d-inline color2">Why Sign Up? </h5>
			          </div>
		          </div>
	        		<div class="card featureReviewCard">
	                <div class="card-body d-flex">
	                    <div class="cardContent">
	                        <i class="fas fa-check-circle color-sks"></i> View college brochures
	                    </div>
	                </div>
	            </div>
	            <br>
	            <div class="card featureReviewCard">
	                <div class="card-body d-flex">
	                    <div class="cardContent">
	                         <i class="fas fa-check-circle color-sks"></i> View Detailed Fees
	                    </div>
	                </div>
	            </div>
	            <br>
	            <div class="card featureReviewCard">
	                <div class="card-body d-flex">
	                    <div class="cardContent">
	                        <i class="fas fa-check-circle color-sks"></i> Identify Potential Colleges and Submit Applications
	                    </div>
	                </div>
	            </div>
	            <br>
	            <div class="card featureReviewCard">
	                <div class="card-body d-flex">
	                    <div class="cardContent">
	                        <i class="fas fa-check-circle color-sks"></i> Ask Questions to senior Counselors
	                    </div>
	                </div>
	            </div>
	            <br>
	            <div class="card featureReviewCard" style="margin-bottom:20px">
	                <div class="card-body d-flex">
	                    <div class="cardContent">
	                        <i class="fas fa-check-circle color-sks"></i> Never miss Important deadlines
	                    </div>
	                </div>
	            </div>
	          </div>
	        </div>
    	</div>

    	<div class="col-lg-6 mb-4 mb-lg-0" style="padding-top: 150px;padding-right: 50px;padding-bottom: 150px;padding-left: 280px;top:-80px">
	      <div class="card userCard">
	        	<div class="card-body">
	        		<div class="row" style="padding-bottom:20px;">
	          		<div class="col-lg-12" style="text-align: center;font-weight: bold;">
			          	<h5 class="m-0 d-inline color2">SIGNIN </h5>
			          </div>
		          </div>
	        		<div class="row">
	        			<div class="col-lg-12" id="verify_msg" style="display:none;">
	        				
	        			</div>
	        		</div>
	        		<form id="form_otp_send" novalidate="novalidate">
	              <div class="row">
	                <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">

	    
                	<div class="form-group col-lg-12">
                    <input type="text" class="form-control" id="otp_send_mobile_no" name="otp_send_mobile_no" aria-describedby="otp_send_mobile_no" placeholder="Enter Mobile number" value="" maxlength="10">
                	</div>
               
          
								<div class="form-group col-sm-12">
                     <button type="submit" class="btn btn-danger px-4 validate" id="btn_request_otp">Request OTP</button>
                  </div>

	              </div>
	            </form>

	            <div class="card userCard p-2 text-center" id="form_otp_verification" style="display:none;border: 0;">
			            <div> <span>A 4 digit One-Time Password has been sent to </span> <span id="ph_no_text"></span> </div><input type="hidden" name="otp_token" id="otp_token" value="">
			            <div id="otp" class="inputs d-flex flex-row justify-content-center mt-2"> 
			            	
			            	<input class="m-2 text-center form-control rounded" type="text" id="first" maxlength="1" /> 
			            	<input class="m-2 text-center form-control rounded" type="text" id="second" maxlength="1"/> 
			            	<input class="m-2 text-center form-control rounded" type="text" id="third" maxlength="1"/> 
			            	<input class="m-2 text-center form-control rounded" type="text" id="fourth" maxlength="1"/> 
			            </div>
			            <div class="mt-4"> <button type="button" id="submit_otp" class="btn btn-danger px-4 validate">Submit OTP</button> </div>
			        </div>


			        <div class="register-section">
							    <span style="color: #000; display: inline-block;font-size: 24px;">Not a member yet ?</span> <span style="display: inline-block;"><h3><a href="<?php echo base_url('signup/student');?>">REGISTER NOW</a></h3></span>
							</div>

							<p class="hr-lines"> OR </p>

							<div class="register-section-as-college">
							    <h><a href="<?php echo base_url('signup/college');?>">Register as College Admin</a></h3>
							</div>

	        	</div>
	      </div>
	    </div>
    </div>

    <div class="row mobile-section">


    	<div class="card userCard">
        	<div class="card-header bg-white">
        	  <h5 class="m-0 d-inline title color2">SIGNIN</h5> 
        	</div>
        	<div class="card-body">
        		<div class="row">
        			<div class="col-lg-12" id="mverify_msg" style="display:none;">
        				
        			</div>
        		</div>
        		<form id="mform_otp_send" novalidate="novalidate" class="form">
	              <div class="row">
	                <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">

	    
                	<div class="form-group col-lg-12">
                    	<input type="text" class="form-control m_otp_inputs" id="motp_send_mobile_no" name="otp_send_mobile_no" aria-describedby="otp_send_mobile_no" placeholder="Enter Mobile number" value="" maxlength="10">
                	</div>
               
          
									<div class="form-group col-lg-12">
                     <button type="submit" class="btn btn-danger px-4 validate" id="mbtn_request_otp">Request OTP</button>
                  </div>

	              </div>
	            </form>

            	<div class="card userCard p-2 text-center" id="mform_otp_verification" style="display:none;border:0;">
		            <div> <span class="m_span">A 4 digit One-Time Password has been sent to </span> <span id="ph_no_text"></span> </div><input type="hidden" name="motp_token" id="motp_token" value="">
		            <div id="otp" class="inputs d-flex flex-row justify-content-center mt-2"> 
		            	
		            	<input class="m-2 text-center form-control rounded m_otp_inputs" type="text" id="mfirst" maxlength="1" /> 
		            	<input class="m-2 text-center form-control rounded m_otp_inputs" type="text" id="msecond" maxlength="1"/> 
		            	<input class="m-2 text-center form-control rounded m_otp_inputs" type="text" id="mthird" maxlength="1"/> 
		            	<input class="m-2 text-center form-control rounded m_otp_inputs" type="text" id="mfourth" maxlength="1"/> 
		            </div>
		            <div class="mt-4"> <button type="button" id="submit_motp" class="btn btn-danger px-4 validate">Submit OTP</button> </div>
		        </div>
        	</div>
        	<div class="register-section">
							    <h2>Not a member yet? <a href="<?php echo base_url('signup/student');?>">REGISTER NOW</a></h2>
							</div>

							<p class="hr-lines"> OR </p>

							<div class="register-section">
							    <h2><a href="<?php echo base_url('signup/college');?>">Register as College Admin</a></h2>
							</div>
        </div>
    	
		
    	
    </div>

  </div>
</div>



<style type="text/css">
	/*.mobile-section {
	  width: 100%;
	}*/

	.profile-content{
		bottom: 0px !important;
		padding-bottom: 0px !important;
	}

	.color-sks{
		color: #fd572e;
	}

	.hr-lines {
	  position: relative;
	  max-width: 500px;
	  margin: 20px 0px;
	  text-align: center;
	}
	.hr-lines:before {
	  content: " ";
	  height: 2px;
	  width: 175px;
	  background: #fd572e;
	  display: block;
	  position: absolute;
	  top: 50%;
	  left: 0;
	}
	.hr-lines:after {
	  content: " ";
	  height: 2px;
	  width: 175px;
	  background: #fd572e;
	  display: block;
	  position: absolute;
	  top: 50%;
	  right: 0;
	}

	.register-section-as-college {
     text-align: center;
     margin-top: 1px;
   }


	.register-section-as-college a {
    text-decoration: none;
    color: #1d1d1e;
    font-size: 17px !important;
    font-weight: bold;
    border-bottom: 2px solid #FF0000;
    padding-bottom: 3px;
}

	.register-section {
        text-align: center;
        margin-top: 1px;
    }

    .register-section h3 {
        color: #FF0000; /* Red color */
        font-size: 24px;
        margin-bottom: 5px; /* Adjust as per the exact spacing */
    }

    .register-section span {
        display: block;
        color: #000000; /* Black color */
        margin-bottom: 20px; /* Adjust as per the exact spacing */
    }

    .register-section a {
        text-decoration: none;
        color: #FF0000; /* Red color */
        font-weight: bold;
        border-bottom: 2px solid #FF0000; /* Red underline */
        padding-bottom: 3px; /* Adjust for proper underline spacing */
    }

	.wrapper-background input[type=text]{
		height: 50px;
    border: 2px solid #fd572e;
    border-radius: 4px;
    background-color: #fff;
    color: #000;
	}

	#btn_request_otp,#submit_otp{
		background-color: #fd572e;
		width: 100%;
		border-radius: 5px;
		font-size: 20px;
	}

	

	.wrapper-background {
	 width: 100%;
	 height: 100vh;
	 background-image: url('<?php echo base_url('public/data/app/app_data/appbg-new-2.png');?>');
	 background-size: cover;
	 background-position: center;
	 background-repeat: no-repeat;
	 top:-23px;
	}

	.userCard{
		border-radius: 0.60rem;
	}

	.featureReviewCard{
		margin-bottom:-13px;
		background-color: #e1e1e1;
	}

	.featureReviewCard .card-body{
		padding:5px;
	}


	.mobile-section .userCard{
		border:none !important;
	}

	.mobile-section .title {
	  text-align: center !important;
	  font-size: 27px;
	  font-weight: 600;
	}

	.mobile-section .text-muted{
		text-align: center !important;
	}

	.mobile-section .m_h6{
		font-size: 1.5rem;
	}

	.mobile-section .m_span{
		font-size: 1.2rem;
	}


	.mobile-section .form {
	  width: 100%;
	}


	.mobile-section input.m_otp_inputs{
		height: 50px;
		border: 1px solid #00000026;
		border-radius: 5px;
		font-size: 15px;
	}

	.mobile-section button {
		width:100%;
		border: none;
		color: #fff;
		font-size: 17px;
		font-weight: 500;
		letter-spacing: 1px;
		border-radius: 6px;
		background-color: rgb(238, 53, 9, 1);
		cursor: pointer;
		transition: all 0.6s ease;
	}

	.mobile-section .button:hover {
	  background-color: rgb(227, 193, 49);
	}

	.mobile-section .card-footer{
		background-color:#fff !important;
	}


	/**INTL**/
	.iti {
  position: relative;
  display: inline-block;
}
.iti * {
  box-sizing: border-box;
}
.iti__hide {
  display: none;
}
.iti__v-hide {
  visibility: hidden;
}
.iti input.iti__tel-input,
.iti input.iti__tel-input[type=text],
.iti input.iti__tel-input[type=tel] {
  position: relative;
  z-index: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-right: 36px;
  margin-right: 0;
}
.iti__flag-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 1px;
}
.iti__selected-flag {
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 6px 0 8px;
}
.iti__arrow {
  margin-left: 6px;
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 4px solid #555;
}
[dir=rtl] .iti__arrow {
  margin-right: 6px;
  margin-left: 0;
}
.iti__arrow--up {
  border-top: none;
  border-bottom: 4px solid #555;
}
.iti__dropdown-content {
  border-radius: 3px;
  background-color: white;
}
.iti--inline-dropdown .iti__dropdown-content {
  position: absolute;
  z-index: 2;
  margin-top: 3px;
  margin-left: -1px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}
.iti__dropdown-content--dropup {
  bottom: 100%;
  margin-bottom: 3px;
}
.iti__search-input {
  width: 100%;
  border-width: 0;
  border-radius: 3px;
  padding: 9px 12px;
}
.iti__search-input + .iti__country-list {
  border-top: 1px solid #ccc;
}
.iti__country-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.iti--inline-dropdown .iti__country-list {
  max-height: 185px;
}
.iti--flexible-dropdown-width .iti__country-list {
  white-space: nowrap;
}
@media (max-width: 500px) {
  .iti--flexible-dropdown-width .iti__country-list {
    white-space: normal;
  }
}
.iti__flag-box {
  display: inline-block;
  width: 20px;
}
.iti__divider {
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid #ccc;
}
.iti__country {
  display: flex;
  align-items: center;
  padding: 8px 8px;
  outline: none;
}
.iti__dial-code {
  color: #999;
}
.iti__country.iti__highlight {
  background-color: rgba(0, 0, 0, 0.05);
}
.iti__flag-box, .iti__country-name {
  margin-right: 8px;
}
[dir=rtl] .iti__flag-box, [dir=rtl] .iti__country-name {
  margin-right: 0;
  margin-left: 8px;
}
.iti--allow-dropdown input.iti__tel-input,
.iti--allow-dropdown input.iti__tel-input[type=text],
.iti--allow-dropdown input.iti__tel-input[type=tel], .iti--show-selected-dial-code input.iti__tel-input,
.iti--show-selected-dial-code input.iti__tel-input[type=text],
.iti--show-selected-dial-code input.iti__tel-input[type=tel] {
  padding-right: 6px;
  padding-left: 52px;
  margin-left: 0;
}
[dir=rtl] .iti--allow-dropdown input.iti__tel-input,
[dir=rtl] .iti--allow-dropdown input.iti__tel-input[type=text],
[dir=rtl] .iti--allow-dropdown input.iti__tel-input[type=tel], [dir=rtl] .iti--show-selected-dial-code input.iti__tel-input,
[dir=rtl] .iti--show-selected-dial-code input.iti__tel-input[type=text],
[dir=rtl] .iti--show-selected-dial-code input.iti__tel-input[type=tel] {
  padding-right: 52px;
  padding-left: 6px;
  margin-right: 0;
}
.iti--allow-dropdown .iti__flag-container, .iti--show-selected-dial-code .iti__flag-container {
  right: auto;
  left: 0;
}
[dir=rtl] .iti--allow-dropdown .iti__flag-container, [dir=rtl] .iti--show-selected-dial-code .iti__flag-container {
  right: 0;
  left: auto;
}
.iti--allow-dropdown .iti__flag-container:hover {
  cursor: pointer;
}
.iti--allow-dropdown .iti__flag-container:hover .iti__selected-flag {
  background-color: rgba(0, 0, 0, 0.05);
}
.iti--allow-dropdown .iti__flag-container:has(+ input[disabled]):hover,
.iti--allow-dropdown .iti__flag-container:has(+ input[readonly]):hover {
  cursor: default;
}
.iti--allow-dropdown .iti__flag-container:has(+ input[disabled]):hover .iti__selected-flag,
.iti--allow-dropdown .iti__flag-container:has(+ input[readonly]):hover .iti__selected-flag {
  background-color: transparent;
}
.iti--show-selected-dial-code .iti__selected-flag {
  background-color: rgba(0, 0, 0, 0.05);
}
.iti--show-selected-dial-code.iti--show-flags .iti__selected-dial-code {
  margin-left: 6px;
}
[dir=rtl] .iti--show-selected-dial-code.iti--show-flags .iti__selected-dial-code {
  margin-left: 0;
  margin-right: 6px;
}
.iti--container {
  position: fixed;
  top: -1000px;
  left: -1000px;
  z-index: 1060;
  padding: 1px;
}
.iti--container:hover {
  cursor: pointer;
}

.iti--fullscreen-popup.iti--container {
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.iti--fullscreen-popup.iti--container.iti--country-search {
  justify-content: flex-start;
}
.iti--fullscreen-popup .iti__dropdown-content {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  position: relative;
}
.iti--fullscreen-popup .iti__country {
  padding: 10px 10px;
  line-height: 1.5em;
}

.iti__flag {
  width: 20px;
}
.iti__flag.iti__be {
  width: 18px;
}
.iti__flag.iti__ch {
  width: 15px;
}
.iti__flag.iti__mc {
  width: 19px;
}
.iti__flag.iti__ne {
  width: 18px;
}
.iti__flag.iti__np {
  width: 13px;
}
.iti__flag.iti__va {
  width: 15px;
}
@media (min-resolution: 2x) {
  .iti__flag {
    background-size: 5762px 15px;
  }
}
.iti__flag.iti__ac {
  height: 10px;
  background-position: 0px 0px;
}
.iti__flag.iti__ad {
  height: 14px;
  background-position: -22px 0px;
}
.iti__flag.iti__ae {
  height: 10px;
  background-position: -44px 0px;
}
.iti__flag.iti__af {
  height: 14px;
  background-position: -66px 0px;
}
.iti__flag.iti__ag {
  height: 14px;
  background-position: -88px 0px;
}
.iti__flag.iti__ai {
  height: 10px;
  background-position: -110px 0px;
}
.iti__flag.iti__al {
  height: 15px;
  background-position: -132px 0px;
}
.iti__flag.iti__am {
  height: 10px;
  background-position: -154px 0px;
}
.iti__flag.iti__ao {
  height: 14px;
  background-position: -176px 0px;
}
.iti__flag.iti__aq {
  height: 14px;
  background-position: -198px 0px;
}
.iti__flag.iti__ar {
  height: 13px;
  background-position: -220px 0px;
}
.iti__flag.iti__as {
  height: 10px;
  background-position: -242px 0px;
}
.iti__flag.iti__at {
  height: 14px;
  background-position: -264px 0px;
}
.iti__flag.iti__au {
  height: 10px;
  background-position: -286px 0px;
}
.iti__flag.iti__aw {
  height: 14px;
  background-position: -308px 0px;
}
.iti__flag.iti__ax {
  height: 13px;
  background-position: -330px 0px;
}
.iti__flag.iti__az {
  height: 10px;
  background-position: -352px 0px;
}
.iti__flag.iti__ba {
  height: 10px;
  background-position: -374px 0px;
}
.iti__flag.iti__bb {
  height: 14px;
  background-position: -396px 0px;
}
.iti__flag.iti__bd {
  height: 12px;
  background-position: -418px 0px;
}
.iti__flag.iti__be {
  height: 15px;
  background-position: -440px 0px;
}
.iti__flag.iti__bf {
  height: 14px;
  background-position: -460px 0px;
}
.iti__flag.iti__bg {
  height: 12px;
  background-position: -482px 0px;
}
.iti__flag.iti__bh {
  height: 12px;
  background-position: -504px 0px;
}
.iti__flag.iti__bi {
  height: 12px;
  background-position: -526px 0px;
}
.iti__flag.iti__bj {
  height: 14px;
  background-position: -548px 0px;
}
.iti__flag.iti__bl {
  height: 14px;
  background-position: -570px 0px;
}
.iti__flag.iti__bm {
  height: 10px;
  background-position: -592px 0px;
}
.iti__flag.iti__bn {
  height: 10px;
  background-position: -614px 0px;
}
.iti__flag.iti__bo {
  height: 14px;
  background-position: -636px 0px;
}
.iti__flag.iti__bq {
  height: 14px;
  background-position: -658px 0px;
}
.iti__flag.iti__br {
  height: 14px;
  background-position: -680px 0px;
}
.iti__flag.iti__bs {
  height: 10px;
  background-position: -702px 0px;
}
.iti__flag.iti__bt {
  height: 14px;
  background-position: -724px 0px;
}
.iti__flag.iti__bv {
  height: 15px;
  background-position: -746px 0px;
}
.iti__flag.iti__bw {
  height: 14px;
  background-position: -768px 0px;
}
.iti__flag.iti__by {
  height: 10px;
  background-position: -790px 0px;
}
.iti__flag.iti__bz {
  height: 12px;
  background-position: -812px 0px;
}
.iti__flag.iti__ca {
  height: 10px;
  background-position: -834px 0px;
}
.iti__flag.iti__cc {
  height: 10px;
  background-position: -856px 0px;
}
.iti__flag.iti__cd {
  height: 15px;
  background-position: -878px 0px;
}
.iti__flag.iti__cf {
  height: 14px;
  background-position: -900px 0px;
}
.iti__flag.iti__cg {
  height: 14px;
  background-position: -922px 0px;
}
.iti__flag.iti__ch {
  height: 15px;
  background-position: -944px 0px;
}
.iti__flag.iti__ci {
  height: 14px;
  background-position: -961px 0px;
}
.iti__flag.iti__ck {
  height: 10px;
  background-position: -983px 0px;
}
.iti__flag.iti__cl {
  height: 14px;
  background-position: -1005px 0px;
}
.iti__flag.iti__cm {
  height: 14px;
  background-position: -1027px 0px;
}
.iti__flag.iti__cn {
  height: 14px;
  background-position: -1049px 0px;
}
.iti__flag.iti__co {
  height: 14px;
  background-position: -1071px 0px;
}
.iti__flag.iti__cp {
  height: 14px;
  background-position: -1093px 0px;
}
.iti__flag.iti__cq {
  height: 12px;
  background-position: -1115px 0px;
}
.iti__flag.iti__cr {
  height: 12px;
  background-position: -1137px 0px;
}
.iti__flag.iti__cu {
  height: 10px;
  background-position: -1159px 0px;
}
.iti__flag.iti__cv {
  height: 12px;
  background-position: -1181px 0px;
}
.iti__flag.iti__cw {
  height: 14px;
  background-position: -1203px 0px;
}
.iti__flag.iti__cx {
  height: 10px;
  background-position: -1225px 0px;
}
.iti__flag.iti__cy {
  height: 14px;
  background-position: -1247px 0px;
}
.iti__flag.iti__cz {
  height: 14px;
  background-position: -1269px 0px;
}
.iti__flag.iti__de {
  height: 12px;
  background-position: -1291px 0px;
}
.iti__flag.iti__dg {
  height: 10px;
  background-position: -1313px 0px;
}
.iti__flag.iti__dj {
  height: 14px;
  background-position: -1335px 0px;
}
.iti__flag.iti__dk {
  height: 15px;
  background-position: -1357px 0px;
}
.iti__flag.iti__dm {
  height: 10px;
  background-position: -1379px 0px;
}
.iti__flag.iti__do {
  height: 14px;
  background-position: -1401px 0px;
}
.iti__flag.iti__dz {
  height: 14px;
  background-position: -1423px 0px;
}
.iti__flag.iti__ea {
  height: 14px;
  background-position: -1445px 0px;
}
.iti__flag.iti__ec {
  height: 14px;
  background-position: -1467px 0px;
}
.iti__flag.iti__ee {
  height: 13px;
  background-position: -1489px 0px;
}
.iti__flag.iti__eg {
  height: 14px;
  background-position: -1511px 0px;
}
.iti__flag.iti__eh {
  height: 10px;
  background-position: -1533px 0px;
}
.iti__flag.iti__er {
  height: 10px;
  background-position: -1555px 0px;
}
.iti__flag.iti__es {
  height: 14px;
  background-position: -1577px 0px;
}
.iti__flag.iti__et {
  height: 10px;
  background-position: -1599px 0px;
}
.iti__flag.iti__eu {
  height: 14px;
  background-position: -1621px 0px;
}
.iti__flag.iti__ez {
  height: 14px;
  background-position: -1643px 0px;
}
.iti__flag.iti__fi {
  height: 12px;
  background-position: -1665px 0px;
}
.iti__flag.iti__fj {
  height: 10px;
  background-position: -1687px 0px;
}
.iti__flag.iti__fk {
  height: 10px;
  background-position: -1709px 0px;
}
.iti__flag.iti__fm {
  height: 11px;
  background-position: -1731px 0px;
}
.iti__flag.iti__fo {
  height: 15px;
  background-position: -1753px 0px;
}
.iti__flag.iti__fr {
  height: 14px;
  background-position: -1775px 0px;
}
.iti__flag.iti__fx {
  height: 14px;
  background-position: -1797px 0px;
}
.iti__flag.iti__ga {
  height: 15px;
  background-position: -1819px 0px;
}
.iti__flag.iti__gb {
  height: 10px;
  background-position: -1841px 0px;
}
.iti__flag.iti__gd {
  height: 12px;
  background-position: -1863px 0px;
}
.iti__flag.iti__ge {
  height: 14px;
  background-position: -1885px 0px;
}
.iti__flag.iti__gf {
  height: 14px;
  background-position: -1907px 0px;
}
.iti__flag.iti__gg {
  height: 14px;
  background-position: -1929px 0px;
}
.iti__flag.iti__gh {
  height: 14px;
  background-position: -1951px 0px;
}
.iti__flag.iti__gi {
  height: 10px;
  background-position: -1973px 0px;
}
.iti__flag.iti__gl {
  height: 14px;
  background-position: -1995px 0px;
}
.iti__flag.iti__gm {
  height: 14px;
  background-position: -2017px 0px;
}
.iti__flag.iti__gn {
  height: 14px;
  background-position: -2039px 0px;
}
.iti__flag.iti__gp {
  height: 14px;
  background-position: -2061px 0px;
}
.iti__flag.iti__gq {
  height: 14px;
  background-position: -2083px 0px;
}
.iti__flag.iti__gr {
  height: 14px;
  background-position: -2105px 0px;
}
.iti__flag.iti__gs {
  height: 10px;
  background-position: -2127px 0px;
}
.iti__flag.iti__gt {
  height: 13px;
  background-position: -2149px 0px;
}
.iti__flag.iti__gu {
  height: 11px;
  background-position: -2171px 0px;
}
.iti__flag.iti__gw {
  height: 10px;
  background-position: -2193px 0px;
}
.iti__flag.iti__gy {
  height: 12px;
  background-position: -2215px 0px;
}
.iti__flag.iti__hk {
  height: 14px;
  background-position: -2237px 0px;
}
.iti__flag.iti__hm {
  height: 10px;
  background-position: -2259px 0px;
}
.iti__flag.iti__hn {
  height: 10px;
  background-position: -2281px 0px;
}
.iti__flag.iti__hr {
  height: 10px;
  background-position: -2303px 0px;
}
.iti__flag.iti__ht {
  height: 12px;
  background-position: -2325px 0px;
}
.iti__flag.iti__hu {
  height: 10px;
  background-position: -2347px 0px;
}
.iti__flag.iti__ic {
  height: 14px;
  background-position: -2369px 0px;
}
.iti__flag.iti__id {
  height: 14px;
  background-position: -2391px 0px;
}
.iti__flag.iti__ie {
  height: 10px;
  background-position: -2413px 0px;
}
.iti__flag.iti__il {
  height: 15px;
  background-position: -2435px 0px;
}
.iti__flag.iti__im {
  height: 10px;
  background-position: -2457px 0px;
}
.iti__flag.iti__in {
  height: 14px;
  background-position: -2479px 0px;
}
.iti__flag.iti__io {
  height: 10px;
  background-position: -2501px 0px;
}
.iti__flag.iti__iq {
  height: 14px;
  background-position: -2523px 0px;
}
.iti__flag.iti__ir {
  height: 12px;
  background-position: -2545px 0px;
}
.iti__flag.iti__is {
  height: 15px;
  background-position: -2567px 0px;
}
.iti__flag.iti__it {
  height: 14px;
  background-position: -2589px 0px;
}
.iti__flag.iti__je {
  height: 12px;
  background-position: -2611px 0px;
}
.iti__flag.iti__jm {
  height: 10px;
  background-position: -2633px 0px;
}
.iti__flag.iti__jo {
  height: 10px;
  background-position: -2655px 0px;
}
.iti__flag.iti__jp {
  height: 14px;
  background-position: -2677px 0px;
}
.iti__flag.iti__ke {
  height: 14px;
  background-position: -2699px 0px;
}
.iti__flag.iti__kg {
  height: 12px;
  background-position: -2721px 0px;
}
.iti__flag.iti__kh {
  height: 13px;
  background-position: -2743px 0px;
}
.iti__flag.iti__ki {
  height: 10px;
  background-position: -2765px 0px;
}
.iti__flag.iti__km {
  height: 12px;
  background-position: -2787px 0px;
}
.iti__flag.iti__kn {
  height: 14px;
  background-position: -2809px 0px;
}
.iti__flag.iti__kp {
  height: 10px;
  background-position: -2831px 0px;
}
.iti__flag.iti__kr {
  height: 14px;
  background-position: -2853px 0px;
}
.iti__flag.iti__kw {
  height: 10px;
  background-position: -2875px 0px;
}
.iti__flag.iti__ky {
  height: 10px;
  background-position: -2897px 0px;
}
.iti__flag.iti__kz {
  height: 10px;
  background-position: -2919px 0px;
}
.iti__flag.iti__la {
  height: 14px;
  background-position: -2941px 0px;
}
.iti__flag.iti__lb {
  height: 14px;
  background-position: -2963px 0px;
}
.iti__flag.iti__lc {
  height: 10px;
  background-position: -2985px 0px;
}
.iti__flag.iti__li {
  height: 12px;
  background-position: -3007px 0px;
}
.iti__flag.iti__lk {
  height: 10px;
  background-position: -3029px 0px;
}
.iti__flag.iti__lr {
  height: 11px;
  background-position: -3051px 0px;
}
.iti__flag.iti__ls {
  height: 14px;
  background-position: -3073px 0px;
}
.iti__flag.iti__lt {
  height: 12px;
  background-position: -3095px 0px;
}
.iti__flag.iti__lu {
  height: 12px;
  background-position: -3117px 0px;
}
.iti__flag.iti__lv {
  height: 10px;
  background-position: -3139px 0px;
}
.iti__flag.iti__ly {
  height: 10px;
  background-position: -3161px 0px;
}
.iti__flag.iti__ma {
  height: 14px;
  background-position: -3183px 0px;
}
.iti__flag.iti__mc {
  height: 15px;
  background-position: -3205px 0px;
}
.iti__flag.iti__md {
  height: 10px;
  background-position: -3226px 0px;
}
.iti__flag.iti__me {
  height: 10px;
  background-position: -3248px 0px;
}
.iti__flag.iti__mf {
  height: 14px;
  background-position: -3270px 0px;
}
.iti__flag.iti__mg {
  height: 14px;
  background-position: -3292px 0px;
}
.iti__flag.iti__mh {
  height: 11px;
  background-position: -3314px 0px;
}
.iti__flag.iti__mk {
  height: 10px;
  background-position: -3336px 0px;
}
.iti__flag.iti__ml {
  height: 14px;
  background-position: -3358px 0px;
}
.iti__flag.iti__mm {
  height: 14px;
  background-position: -3380px 0px;
}
.iti__flag.iti__mn {
  height: 10px;
  background-position: -3402px 0px;
}
.iti__flag.iti__mo {
  height: 14px;
  background-position: -3424px 0px;
}
.iti__flag.iti__mp {
  height: 10px;
  background-position: -3446px 0px;
}
.iti__flag.iti__mq {
  height: 14px;
  background-position: -3468px 0px;
}
.iti__flag.iti__mr {
  height: 14px;
  background-position: -3490px 0px;
}
.iti__flag.iti__ms {
  height: 10px;
  background-position: -3512px 0px;
}
.iti__flag.iti__mt {
  height: 14px;
  background-position: -3534px 0px;
}
.iti__flag.iti__mu {
  height: 14px;
  background-position: -3556px 0px;
}
.iti__flag.iti__mv {
  height: 14px;
  background-position: -3578px 0px;
}
.iti__flag.iti__mw {
  height: 14px;
  background-position: -3600px 0px;
}
.iti__flag.iti__mx {
  height: 12px;
  background-position: -3622px 0px;
}
.iti__flag.iti__my {
  height: 10px;
  background-position: -3644px 0px;
}
.iti__flag.iti__mz {
  height: 14px;
  background-position: -3666px 0px;
}
.iti__flag.iti__na {
  height: 14px;
  background-position: -3688px 0px;
}
.iti__flag.iti__nc {
  height: 10px;
  background-position: -3710px 0px;
}
.iti__flag.iti__ne {
  height: 15px;
  background-position: -3732px 0px;
}
.iti__flag.iti__nf {
  height: 10px;
  background-position: -3752px 0px;
}
.iti__flag.iti__ng {
  height: 10px;
  background-position: -3774px 0px;
}
.iti__flag.iti__ni {
  height: 12px;
  background-position: -3796px 0px;
}
.iti__flag.iti__nl {
  height: 14px;
  background-position: -3818px 0px;
}
.iti__flag.iti__no {
  height: 15px;
  background-position: -3840px 0px;
}
.iti__flag.iti__np {
  height: 15px;
  background-position: -3862px 0px;
}
.iti__flag.iti__nr {
  height: 10px;
  background-position: -3877px 0px;
}
.iti__flag.iti__nu {
  height: 10px;
  background-position: -3899px 0px;
}
.iti__flag.iti__nz {
  height: 10px;
  background-position: -3921px 0px;
}
.iti__flag.iti__om {
  height: 10px;
  background-position: -3943px 0px;
}
.iti__flag.iti__pa {
  height: 14px;
  background-position: -3965px 0px;
}
.iti__flag.iti__pe {
  height: 14px;
  background-position: -3987px 0px;
}
.iti__flag.iti__pf {
  height: 14px;
  background-position: -4009px 0px;
}
.iti__flag.iti__pg {
  height: 15px;
  background-position: -4031px 0px;
}
.iti__flag.iti__ph {
  height: 10px;
  background-position: -4053px 0px;
}
.iti__flag.iti__pk {
  height: 14px;
  background-position: -4075px 0px;
}
.iti__flag.iti__pl {
  height: 13px;
  background-position: -4097px 0px;
}
.iti__flag.iti__pm {
  height: 14px;
  background-position: -4119px 0px;
}
.iti__flag.iti__pn {
  height: 10px;
  background-position: -4141px 0px;
}
.iti__flag.iti__pr {
  height: 14px;
  background-position: -4163px 0px;
}
.iti__flag.iti__ps {
  height: 10px;
  background-position: -4185px 0px;
}
.iti__flag.iti__pt {
  height: 14px;
  background-position: -4207px 0px;
}
.iti__flag.iti__pw {
  height: 13px;
  background-position: -4229px 0px;
}
.iti__flag.iti__py {
  height: 11px;
  background-position: -4251px 0px;
}
.iti__flag.iti__qa {
  height: 8px;
  background-position: -4273px 0px;
}
.iti__flag.iti__re {
  height: 14px;
  background-position: -4295px 0px;
}
.iti__flag.iti__ro {
  height: 14px;
  background-position: -4317px 0px;
}
.iti__flag.iti__rs {
  height: 14px;
  background-position: -4339px 0px;
}
.iti__flag.iti__ru {
  height: 14px;
  background-position: -4361px 0px;
}
.iti__flag.iti__rw {
  height: 14px;
  background-position: -4383px 0px;
}
.iti__flag.iti__sa {
  height: 14px;
  background-position: -4405px 0px;
}
.iti__flag.iti__sb {
  height: 10px;
  background-position: -4427px 0px;
}
.iti__flag.iti__sc {
  height: 10px;
  background-position: -4449px 0px;
}
.iti__flag.iti__sd {
  height: 10px;
  background-position: -4471px 0px;
}
.iti__flag.iti__se {
  height: 13px;
  background-position: -4493px 0px;
}
.iti__flag.iti__sg {
  height: 14px;
  background-position: -4515px 0px;
}
.iti__flag.iti__sh {
  height: 10px;
  background-position: -4537px 0px;
}
.iti__flag.iti__si {
  height: 10px;
  background-position: -4559px 0px;
}
.iti__flag.iti__sj {
  height: 15px;
  background-position: -4581px 0px;
}
.iti__flag.iti__sk {
  height: 14px;
  background-position: -4603px 0px;
}
.iti__flag.iti__sl {
  height: 14px;
  background-position: -4625px 0px;
}
.iti__flag.iti__sm {
  height: 15px;
  background-position: -4647px 0px;
}
.iti__flag.iti__sn {
  height: 14px;
  background-position: -4669px 0px;
}
.iti__flag.iti__so {
  height: 14px;
  background-position: -4691px 0px;
}
.iti__flag.iti__sr {
  height: 14px;
  background-position: -4713px 0px;
}
.iti__flag.iti__ss {
  height: 10px;
  background-position: -4735px 0px;
}
.iti__flag.iti__st {
  height: 10px;
  background-position: -4757px 0px;
}
.iti__flag.iti__su {
  height: 10px;
  background-position: -4779px 0px;
}
.iti__flag.iti__sv {
  height: 12px;
  background-position: -4801px 0px;
}
.iti__flag.iti__sx {
  height: 14px;
  background-position: -4823px 0px;
}
.iti__flag.iti__sy {
  height: 14px;
  background-position: -4845px 0px;
}
.iti__flag.iti__sz {
  height: 14px;
  background-position: -4867px 0px;
}
.iti__flag.iti__ta {
  height: 10px;
  background-position: -4889px 0px;
}
.iti__flag.iti__tc {
  height: 10px;
  background-position: -4911px 0px;
}
.iti__flag.iti__td {
  height: 14px;
  background-position: -4933px 0px;
}
.iti__flag.iti__tf {
  height: 14px;
  background-position: -4955px 0px;
}
.iti__flag.iti__tg {
  height: 13px;
  background-position: -4977px 0px;
}
.iti__flag.iti__th {
  height: 14px;
  background-position: -4999px 0px;
}
.iti__flag.iti__tj {
  height: 10px;
  background-position: -5021px 0px;
}
.iti__flag.iti__tk {
  height: 10px;
  background-position: -5043px 0px;
}
.iti__flag.iti__tl {
  height: 10px;
  background-position: -5065px 0px;
}
.iti__flag.iti__tm {
  height: 14px;
  background-position: -5087px 0px;
}
.iti__flag.iti__tn {
  height: 14px;
  background-position: -5109px 0px;
}
.iti__flag.iti__to {
  height: 10px;
  background-position: -5131px 0px;
}
.iti__flag.iti__tr {
  height: 14px;
  background-position: -5153px 0px;
}
.iti__flag.iti__tt {
  height: 12px;
  background-position: -5175px 0px;
}
.iti__flag.iti__tv {
  height: 10px;
  background-position: -5197px 0px;
}
.iti__flag.iti__tw {
  height: 14px;
  background-position: -5219px 0px;
}
.iti__flag.iti__tz {
  height: 14px;
  background-position: -5241px 0px;
}
.iti__flag.iti__ua {
  height: 14px;
  background-position: -5263px 0px;
}
.iti__flag.iti__ug {
  height: 14px;
  background-position: -5285px 0px;
}
.iti__flag.iti__uk {
  height: 10px;
  background-position: -5307px 0px;
}
.iti__flag.iti__um {
  height: 11px;
  background-position: -5329px 0px;
}
.iti__flag.iti__un {
  height: 14px;
  background-position: -5351px 0px;
}
.iti__flag.iti__us {
  height: 11px;
  background-position: -5373px 0px;
}
.iti__flag.iti__uy {
  height: 14px;
  background-position: -5395px 0px;
}
.iti__flag.iti__uz {
  height: 10px;
  background-position: -5417px 0px;
}
.iti__flag.iti__va {
  height: 15px;
  background-position: -5439px 0px;
}
.iti__flag.iti__vc {
  height: 14px;
  background-position: -5456px 0px;
}
.iti__flag.iti__ve {
  height: 14px;
  background-position: -5478px 0px;
}
.iti__flag.iti__vg {
  height: 10px;
  background-position: -5500px 0px;
}
.iti__flag.iti__vi {
  height: 14px;
  background-position: -5522px 0px;
}
.iti__flag.iti__vn {
  height: 14px;
  background-position: -5544px 0px;
}
.iti__flag.iti__vu {
  height: 12px;
  background-position: -5566px 0px;
}
.iti__flag.iti__wf {
  height: 14px;
  background-position: -5588px 0px;
}
.iti__flag.iti__ws {
  height: 10px;
  background-position: -5610px 0px;
}
.iti__flag.iti__xk {
  height: 15px;
  background-position: -5632px 0px;
}
.iti__flag.iti__ye {
  height: 14px;
  background-position: -5654px 0px;
}
.iti__flag.iti__yt {
  height: 14px;
  background-position: -5676px 0px;
}
.iti__flag.iti__za {
  height: 14px;
  background-position: -5698px 0px;
}
.iti__flag.iti__zm {
  height: 14px;
  background-position: -5720px 0px;
}
.iti__flag.iti__zw {
  height: 10px;
  background-position: -5742px 0px;
}

.iti__flag {
  height: 15px;
  box-shadow: 0px 0px 1px 0px #888;
  background-image: url("<?php echo base_url('public/data/app/app_data/flags.png?1');?>");
  background-repeat: no-repeat;
  background-position: 20px 0;
}

.iti--inline-dropdown{
	width:100% !important;
}
@media (min-resolution: 2x) {
  .iti__flag {
    background-image: url("<?php echo base_url('public/data/app/app_data/flags@2x.png?1');?>");
  }
}

.iti__globe {
  background-image: url("<?php echo base_url('public/data/app/app_data/globe.png');?>");
  background-size: contain;
  background-position: right;
  box-shadow: none;
  height: 19px;
}
@media (min-resolution: 2x) {
  .iti__globe {
    background-image: url("<?php echo base_url('public/data/app/app_data/globe@2x.png');?>");
  }
}

</style>

<?php $this->widget->run('front_top_colleges_section',TRUE);?>

<?php $this->widget->run('front_top_courses_section',TRUE);?>

<?php $this->widget->run('front_top_study_places',TRUE);?>

<?php $this->widget->run('front_top_exam_section',TRUE);?>

<?php $this->widget->run('front_mobile_app_section',TRUE);?>

<section class="commonSec futureSec bg-white ">
  <div class="wrapper">

    <div class="col-lg-12">
      
      <p>
        Sikshapedia.com is the only solution that helps students come across the names of some of the <strong>top educational institutions in India</strong> for undergraduate and postgraduate courses. Having a strong brand base, it offers the users a unique privilege to lessen the hassle of shortlisting the best colleges in India. 
      </p>

      <p>
        Our web page is a repository of some of the highly reliable and up-to-date information of more than 10,000+ <strong>top universities &amp; colleges in India</strong> along with the best courses and a genuinely registered database of more than millions of students. We have been offering some specific information to students having an interest in UG or PG courses in India. 
      </p>

      <p>
        </p><h2>Come Across the Latest Updates</h2>
      <p></p>

      <p>
        Logging in to our website, you will come across the latest updates in some of the highly popular streams of education that range from Management to Engineering. As an education seeker, you will be able to come across a personalized experience by visiting our website. Based on your field of interest and educational background, you will be able to shortlist the names of some of the <strong>top universities in India</strong>. 
      </p>


      <p>
        Our team comprises a team of career counseling experts that are always ready to address all your queries. Students may freely put up their queries regarding coming across some of the <strong>best universities in India</strong> through a detailed discussion. It will help them to clarify all their doubts in a single go. 
      </p>

      <p>
        </p><h2>Get to Know about the Latest Changes in the Industry</h2>
        <p>
          The counselors keep themselves up to date with the latest changes taking place in the industry. Thus, if there is confusion regarding the selection of courses and <strong>best colleges in India</strong>; then you may talk to our experts anytime without any hesitation. It will be our pleasure to assist you. 
        </p>

        <p>
          Sikshapedia has been recognized to be among the smartest gateways that have been successful in blending domain knowledge about higher education along with the latest technology and innovation. It will provide students a highly personalized insight in making an informed decision regarding the right career along with course as well as college.
        </p>

        <p>
          We are here to provide the students with a non-conventional platform that will simply focus on the delivery of high-quality leads. It will help the students to gather information about some of the <strong>top educational institutions in India</strong>. The algorithm on our website permits us in segregating the data to multiple levels, thus providing an edge to the students that are looking for a specific and active database. 
        </p>

        <p>
          We are here to provide a multi-purpose filter page that will help in sorting the data related to <strong>top universities in India</strong> based on the cut-off, fee, and rank. With a highly skilled team of data miners, we ensure that students will be able to make highly informed decisions regarding their bright careers.
        </p>
      <p></p>
    </div>

  </div>
</section>

<?php $this->widget->run('front_subscription_section',TRUE);?>

<script type="text/javascript">var page='';var wbpage='';</script>

<script type="text/javascript">

	document.addEventListener("DOMContentLoaded", function (event) {
		function OTPInput() {
		    const inputs = document.querySelectorAll("#otp > *[id]");
		    
		    for (let i = 0; i < inputs.length; i++) {
		        inputs[i].addEventListener("input", function (event) {
		            const value = event.target.value;
		            
		            if (value.length === 1) {
		                if (i !== inputs.length - 1) {
		                    inputs[i + 1].focus();
		                } else {
		                    inputs[i].blur(); // Remove focus after last input
		                }
		            } else if (value.length === 0) {
		                if (i !== 0) {
		                    inputs[i - 1].focus();
		                }
		            }
		        });

		        // Handle backspace key
		        inputs[i].addEventListener("keydown", function (event) {
		            if (event.key === "Backspace") {
		                //event.preventDefault(); // Prevent default backspace behavior
		                 inputs[i].value = "";
		                 if (i !== 0) inputs[i - 1].focus();
		            }
		        });
		    }
		}

		// Call the OTPInput function to initialize it.
		OTPInput();



	    $('#form_otp_send').validate({
	    	rules:{
	    		otp_send_mobile_no:{
	    			required:true,
	    			digits:true,
	    			minlength:10,
	    			maxlength:10
	    		}
	    	},
	    	messages:{
	    		otp_send_mobile_no:{
	    			required:'Enter mobile number',
	    			digits:'Only numeric value allowed'
	    		}
	    	},
	    	submitHandler:function(){

	    		var formData = new FormData($('#form_otp_send')[0]);
	    		formData.append('action_type','send_login_otp');

	    		$.ajax({
	    			type:'POST',
	    			url:'<?php echo base_url('signinwithotp');?>',
	    			data:formData,
		            cache: false,
		            contentType: false,
		            processData: false,
		            timeout: 60000000,
	    			beforeSend:function(){
	    				$('#btn_request_otp').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	    			},
	    			success:function(d){
	    				if(d.success){
	    					$('#form_otp_send').css('display','none');
				    		$('#ph_no_text').html($('#otp_send_mobile_no').val());
				    		$('#otp_token').val(d.otp_token);
				    		$('#form_otp_verification').css('display','block');
				    		$('#first').focus();
	    				}else{
	    					$('#verify_msg').html(d.error).css('display','block');
	    					$('#btn_request_otp').html('Request OTP').prop('disabled',false);
	    					$('#otp_send_mobile_no').focus();

	    					if(d.redirect){
	    						setTimeout(function(){
	    							window.location.href=d.redirect;
	    						},2200);	
	    					}

	    					setTimeout(function(){
	    						$('#verify_msg').html('').css('display','none');
	    					},1200);
	    				}
	    				
			    		
	    			}
	    		});


			    		
	    	}
	    });

	    $('#mform_otp_send').validate({
	    	rules:{
	    		otp_send_mobile_no:{
	    			required:true,
	    			digits:true,
	    			minlength:10,
	    			maxlength:10
	    		}
	    	},
	    	messages:{
	    		otp_send_mobile_no:{
	    			required:'Enter mobile number',
	    			digits:'Only numeric value allowed'
	    		}
	    	},
	    	submitHandler:function(){

	    		var formData = new FormData($('#mform_otp_send')[0]);
	    		formData.append('action_type','send_login_otp');

	    		$.ajax({
	    			type:'POST',
	    			url:'<?php echo base_url('signinwithotp');?>',
	    			data:formData,
		            cache: false,
		            contentType: false,
		            processData: false,
		            timeout: 60000000,
	    			beforeSend:function(){
	    				$('#mbtn_request_otp').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	    			},
	    			success:function(d){
	    				if(d.success){
	    					$('#mform_otp_send').css('display','none');
				    		$('#mph_no_text').html($('#otp_send_mobile_no').val());
				    		$('#motp_token').val(d.otp_token);
				    		$('#mform_otp_verification').css('display','block');
				    		$('#mfirst').focus();
	    				}else{
	    					$('#mverify_msg').html(d.error).css('display','block');

	    					if(d.redirect){
	    						setTimeout(function(){
	    							window.location.href=d.redirect;
	    						},1200);	
	    					}


	    					$('#mbtn_request_otp').html('Request OTP').prop('disabled',false);
	    					$('#motp_send_mobile_no').focus();

	    					setTimeout(function(){
	    						$('#mverify_msg').html('').css('display','none');
	    					},1200);
	    				}
	    				
			    		
	    			}
	    		});


			    		
	    	}
	    });

	    $('body').on('click','#submit_otp',function(){
	    	var otp_no='';
	    	const inputs = document.querySelectorAll("#otp > *[id]");
	    	for (let i = 0; i < inputs.length; i++){
	    		otp_no+=inputs[i].value.toString();
	    	}
	    	var otp_token=$('#otp_token').val();

	    	var review_link='';

	    	 // Check if review_link exists in localStorage
		      var reviewLinkExists = window.localStorage.getItem('review_link') !== null;

		      if (reviewLinkExists) {
		          review_link=window.localStorage.getItem('review_link');
		      }else{
		      	review_link='';
		      }

	    	$.ajax({
	    			type:'POST',
	    			url:'<?php echo base_url('signinwithotp');?>',
	    			data:{[csrf_name]:csrf_hash,action_type:'verify_login_otp',otp_no:otp_no,otp_token:otp_token,review_link:review_link,slg:'<?php echo $slg;?>',cid:'<?php echo $cid;?>'},
	    			beforeSend:function(){
	    				$('#submit_otp').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	    			},
	    			success:function(d){
	    				if(d.redirect){
	    					window.location.href=d.redirect;
	    				}else{
	    					$('#verify_msg').html(d.error).css('display','block');
	    					$('#submit_otp').html('Submit OTP').prop('disabled',false);
	    					setTimeout(function(){
	    						$('#verify_msg').html('').css('display','none');
	    					},1200);
	    				}
	    			}
	    	});

	    });

	    $('body').on('click','#submit_motp',function(){
	    	var otp_no='';
	    	const inputs = document.querySelectorAll("#otp > *[id]");
	    	for (let i = 0; i < inputs.length; i++){
	    		otp_no+=inputs[i].value.toString();
	    	}
	    	var otp_token=$('#motp_token').val();

	    	var review_link='';

	    	 // Check if review_link exists in localStorage
		      var reviewLinkExists = window.localStorage.getItem('review_link') !== null;

		      if (reviewLinkExists) {
		          review_link=window.localStorage.getItem('review_link');
		      }else{
		      	review_link='';
		      }

	    	$.ajax({
	    			type:'POST',
	    			url:'<?php echo base_url('signinwithotp');?>',
	    			data:{[csrf_name]:csrf_hash,action_type:'verify_login_otp',otp_no:otp_no,otp_token:otp_token,review_link:review_link},
	    			beforeSend:function(){
	    				$('#submit_motp').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	    			},
	    			success:function(d){
	    				if(d.redirect){
	    					window.location.href=d.redirect;
	    				}else{
	    					$('#verify_msg').html(d.error).css('display','block');
	    					$('#submit_motp').html('Submit OTP').prop('disabled',false);
	    					setTimeout(function(){
	    						$('#verify_msg').html('').css('display','none');
	    					},1200);
	    				}
	    			}
	    	});

	    });
	});

</script>