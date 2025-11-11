<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="profile-content py-4 bg-white" style="padding-bottom:20px;">
  <div class="wrapper">
    <div class="row non-mobile-section">
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
	        <div class="card userCard">
	        	<div class="card-header bg-white">
	        	  <h5 class="m-0 d-inline">Signin </h5> 
	        	</div>
	        	<div class="card-body">
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

	            <div class="card userCard p-2 text-center" id="form_otp_verification" style="display:none;">
			            <h6>Please enter the one time password <br> to verify your account</h6>
			            <div> <span>A 4 digit One-Time Password has been sent to </span> <span id="ph_no_text"></span> </div><input type="hidden" name="otp_token" id="otp_token" value="">
			            <div id="otp" class="inputs d-flex flex-row justify-content-center mt-2"> 
			            	
			            	<input class="m-2 text-center form-control rounded" type="text" id="first" maxlength="1" /> 
			            	<input class="m-2 text-center form-control rounded" type="text" id="second" maxlength="1"/> 
			            	<input class="m-2 text-center form-control rounded" type="text" id="third" maxlength="1"/> 
			            	<input class="m-2 text-center form-control rounded" type="text" id="fourth" maxlength="1"/> 
			            </div>
			            <div class="mt-4"> <button type="button" id="submit_otp" class="btn btn-danger px-4 validate">Submit OTP</button> </div>
			        </div>



	        	</div>
	        	<div class="card-footer">
	        		<small id="user_type" class="form-text text-muted">Not Register yet. <a href="<?php echo base_url('signup/student');?>">Register Now.</a>It's free</small>
	        	</div>
	        </div>
	    </div>			
    </div>

    <div class="row mobile-section">


    	<div class="card userCard">
        	<div class="card-header bg-white">
        	  <h5 class="m-0 d-inline title">Signin </h5> 
        	</div>
        	<div class="card-body">
        		<div class="row">
        			<div class="col-lg-12" id="verify_msg" style="display:none;">
        				
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

            	<div class="card userCard p-2 text-center" id="mform_otp_verification" style="display:none;">
		            <h6 class="m_h6">Please enter the one time password <br> to verify your account</h6>
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
        	<div class="card-footer">
        		<small class="form-text text-muted">Not Register yet. <a href="<?php echo base_url();?>signup/student">Register Now</a>.It's free</small>
        	</div>
        </div>
    	
		
    	
    </div>

  </div>
</div>

<style type="text/css">
	/*.mobile-section {
	  width: 100%;
	}*/

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


</style>

<?php $this->widget->run('front_top_colleges_section',TRUE);?>

<?php $this->widget->run('front_top_study_places',TRUE);?>

<?php $this->widget->run('front_mobile_app_section',TRUE);?>

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
	    					$('#verify_msg').html(d.error).css('display','block');
	    					$('#mbtn_request_otp').html('Request OTP').prop('disabled',false);
	    					$('#motp_send_mobile_no').focus();

	    					setTimeout(function(){
	    						$('#verify_msg').html('').css('display','none');
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
	    			data:{[csrf_name]:csrf_hash,action_type:'verify_login_otp',otp_no:otp_no,otp_token:otp_token,review_link:review_link},
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