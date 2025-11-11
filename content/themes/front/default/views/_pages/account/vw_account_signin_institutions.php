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
                    	<input type="text" class="form-control" id="inst_username" name="inst_username" aria-describedby="inst_username" placeholder="Enter Username" value="">
                	</div>

                	<div class="form-group col-lg-12">
                    	<input type="password" class="form-control" id="inst_password" name="inst_password" aria-describedby="inst_password" placeholder="Enter Password" value="">
                	</div>
               
          
					<div class="form-group col-sm-12">
                     <button type="submit" class="btn btn-danger px-4 validate" id="btn_inst_signin">Signin Now</button>
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
	        		<small id="user_type" class="form-text text-muted">Not Register yet. <a href="<?php echo base_url();?>signup/student">Register Now</a></small>
	        	</div>
	        </div>
	    </div>
			
    </div>

  </div>
</div>

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
	    		inst_username:{
	    			required:true,
	    		},
	    		inst_password:{
	    			required:true
	    		}
	    	},
	    	messages:{
	    		inst_username:{
	    			required:'Enter username'
	    		},
	    		inst_password:{
	    			required:'Enter password'
	    		}
	    	},
	    	submitHandler:function(){

	    		var formData = new FormData($('#form_otp_send')[0]);
	    		formData.append('action_type','send_login_otp');

	    		$.ajax({
	    			type:'POST',
	    			url:'<?php echo base_url('instlogin');?>',
	    			data:formData,
		            cache: false,
		            contentType: false,
		            processData: false,
		            timeout: 60000000,
	    			beforeSend:function(){
	    				$('#btn_inst_signin').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	    			},
	    			success:function(d){
	    				if(d.success){
	    					window.location.href=d.redirect;
	    				}else{
	    					$('#verify_msg').html(d.error).css('display','block');
	    					$('#btn_inst_signin').html('Sign In').prop('disabled',false);

	    					setTimeout(function(){
	    						$('#verify_msg').html('').css('display','none');
	    					},1200);
	    				}	
	    			}
	    		});   		
	    	}
	    });


	});

</script>