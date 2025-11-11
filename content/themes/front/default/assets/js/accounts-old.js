jQuery(function($) {
  "use strict";

  jQuery.validator.addMethod("pwcheck", function (value, element) {
    return this.optional(element) || /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
  }, "Password must contain atleast one digit , one lowercase letter , one uppercase letter and one special character(!@#$%^&)");

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
  	return arg !== value;
  }, "Value must not equal arg.");

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 10000
  });

  $("#register_country").chosen({no_results_text: "Select Country"});
  $("#register_state").chosen({no_results_text: "Select State"});
  $("#register_city").chosen({no_results_text: "Select City"});

  $('body').on('click','#apply_schoarship',function(){
  	$('#logModal').find('#sign_up_btns').attr('data-login_from','scholarship');
  });

  $('body').on('click','#sign_up_btns',function(){
  	$('#regModal').find('#form_register #registration_from').val($(this).attr('data-login_from'));
  });

  $('body').on('click','#login_from_link',function(){
  	$('#logModal').find('#sign_up_btns').attr('data-login_from','scholarship');
  	$('#adsYouModal').modal('hide');
  });


  $.validator.setDefaults({
      ignore: []
  });

  $('#form_register').validate({
  	rules:{
  		registration_name:{
  			required:true
  		},
  		registration_email:{
  			required:true,
  			email:true
  		},
  		registration_phone_no:{
  			required:true
  		},
  		registration_password:{
  			required:true,
  			minlength:8,
        	maxlength:16,
        	pwcheck:true
  		},
  		registration_conf_password: {
	      equalTo: "#registration_password"
	    },
  		register_country:{
  			valueNotEquals:''
  		},
  		register_state:{
  			valueNotEquals:''
  		},
  		register_city:{
  			valueNotEquals:''
  		}
  	},
  	errorPlacement: function (error, element) {
        if (element.attr("name") == "register_state") {
            error.insertAfter($('#register_state_chosen'))
        }else if (element.attr("name") == "register_city") {
            error.insertAfter($('#register_city_chosen'))
        }else if (element.attr("name") == "register_country") {
            error.insertAfter($('#register_country_chosen'))
        }else{
        	error.insertAfter(element)
        }
    },
  	messages:{
  		registration_name:{
  			required:'Please enter your name'
  		},
  		registration_email:{
  			required:'Please enter email id',
  			email:'Email address is not valid'
  		},
  		registration_phone_no:{
  			required:'Please enter phone no'
  		},
  		registration_password:{
  			required:'Please enter your password',
        	minlength:'Minimum 8 characters required',
        	maxlength:'Maximum 16 characters allowed'
  		},
  		register_country:{
  			valueNotEquals:'Please select country'
  		},
  		register_state:{
  			valueNotEquals:'Please select state'
  		},
  		register_city:{
  			valueNotEquals:'Please select city'
  		}
  	},
  	submitHandler:function(f){
  		//var f_data = FormDataJson.formToJson(document.getElementById("form_register"));
      	//var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      	console.log($("#form_register").serialize());

      	$.ajax({
	        type:'POST',
	        url:base_url+'register',
	        data: $("#form_register").serialize(),
	        cache:false,
	        beforeSend:function(){
	          $('#registration_name').prop('disabled',true);
	          $('#registration_email').prop('disabled',true);
	          $('#registration_phone_no').prop('disabled',true);
	          $('#registration_password').prop('disabled',true)
	          $('#btn_create_account').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	        },
	        success:function(d,status,xhr){
	        	//alert(d.error);
	          if(d.success){
	            //setTimeout(function(){
	              Toast.fire({
							    icon: 'success',
							    title: d.success
							  });
	              $('#registration_name').prop('disabled',false);
	          		$('#registration_email').prop('disabled',false);
	          		$('#registration_phone_no').prop('disabled',false);
	          		$('#registration_password').prop('disabled',false)
	            	$('#btn_create_account').html('Create Account').prop('disabled',false);

	            	$('#form_register')[0].reset();
	            	$('#otp_label').html(d.success_msg_otp);
	            	$('#registration_user').val(d.otp_user);
	            	$('#reg_dev').css('display','none');
	            	$('#otp_div').css('display','block');
	            	//$('#regModal').modal('hide');
	            //},1200);	            
	          }else if(d.error){
	          	Toast.fire({
							    icon: 'error',
							    title: d.error
							});

							
	            $('#registration_name').prop('disabled',false);
	          	$('#registration_email').prop('disabled',false);
	          	$('#registration_phone_no').prop('disabled',false);
	          	$('#registration_password').prop('disabled',false)
	            $('#btn_create_account').html('Create Account').prop('disabled',false);
	          }
	        },
	        error: function( jqXhr ) {
		        if( jqXhr.status == 400 ) {
		        	window.location.reload();
		        }else if( jqXhr.status == 403 ) {
		        	window.location.reload();
		        }
							$('#registration_name').prop('disabled',false);
	          	$('#registration_email').prop('disabled',false);
	          	$('#registration_phone_no').prop('disabled',false);
	          	$('#registration_password').prop('disabled',false)
	            $('#btn_create_account').html('Create Account').prop('disabled',false);
	        },
	        complete:function(status,xhr){
	         // $('#btn_submit').html('Sign In');
	        }
	    	});
  	}
  });


  $('#form_register_otp').validate({
  	rules:{
  		registration_otp:{
  			required:true,
  			number:true,
  			minlength:6,
  			maxlength:6
  		}
  	},
  	messages:{
  		registration_otp:{
  			required:'Enter 6 digit OTP',
  			number:'Only numeric value allowed',
  			minlength:'OTP invalid',
  			maxlength:'OTP invalid'
  		}
  	},
  	submitHandler:function(){
  		var f_data = FormDataJson.formToJson(document.getElementById("form_register_otp"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

  		$.ajax({
  			type:'POST',
  			url:base_url+'otpverify',
  			data:{registration_otp:$('#registration_otp').val(),registration_user:$('#registration_user').val(),csrf_test_name:csrf_hash},
  			beforeSend:function(){
  				$('#registration_otp').prop('disabled',true);
	        $('#btn_create_account_verify').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
  			},
  			success:function(d){
  				if(d.success){
  					Toast.fire({
					    icon: 'success',
					    title: d.success
					  });
	          $('#registration_otp').prop('disabled',false);
	        	$('#btn_create_account_verify').html('Phone No. Verified').prop('disabled',true);

	        	$('#form_register_otp')[0].reset();
	        	$('#regModal').modal('hide');
	        	window.location.href=d.redirect;
  				}else if(d.error){
  					Toast.fire({
					    icon: 'error',
					    title: d.error
					  });

					  $('#registration_otp').prop('disabled',false);
	        	$('#btn_create_account_verify').html('Verify Phone No').prop('disabled',false);
  				}	  				
  			},
  			complete:function(status,xhr){
	        $('#registration_otp').prop('disabled',false);
	        $('#btn_create_account_verify').html('Verify Phone No').prop('disabled',false);
	      }
  		});
  	}
  });

  $('#form_login').validate({
  	rules:{
  		user_name:{
  			required:true,
  			email:false  			
  		},
  		user_password:{
  			required:true,
  			minlength:8,
        	maxlength:16,
        	pwcheck:true
  		},
  	},
  	messages:{
  		user_name:{
  			required:'Please enter user name',
  			email:'Email address is not valid'
  		},
  		user_password:{
  			required:'Please enter your password',
        	minlength:'Minimum 8 characters required',
        	maxlength:'Maximum 16 characters allowed'
  		},
  	},
  	submitHandler:function(f){
  		var f_data = FormDataJson.formToJson(document.getElementById("form_login"));
      	var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      	$.ajax({
	        type:'POST',
	        url:base_url+'login',
	        data: $('#form_login').serialize(),
	        cache:false,
	        beforeSend:function(){
	          $('#user_name').prop('disabled',true);
	          $('#user_password').prop('disabled',true);
	          $('#btn_login').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	        },
	        success:function(d,status,xhr){
	          if(d.success){
	            setTimeout(function(){
	              	$('#user_name').prop('disabled',false);
	          		$('#user_password').prop('disabled',false);
	            	$('#btn_login').html(d.success).prop('disabled',false);
	            	window.location.href=d.redirect;
	            },1200);	            
	          }else{
	          	Toast.fire({
							    icon: 'error',
							    title: d.error
							});
	           	$('#user_name').prop('disabled',false);
	          	$('#user_password').prop('disabled',false);
	            $('#btn_login').html('Log In').prop('disabled',false);
	          }
	        },
	        error: function( jqXhr ) {
		        if( jqXhr.status == 400 ) {
		        	window.location.reload();
		        }else if( jqXhr.status == 403 ) {
		        	window.location.reload();
		        }
				$('#user_name').prop('disabled',false);
	          	$('#user_password').prop('disabled',false);
	            $('#btn_login').html('Log In').prop('disabled',false);
	        },
	        complete:function(status,xhr){
	         // $('#btn_submit').html('Sign In');
	        }
	    });
  	}
  });

  $('body').on('click','#forget_link',function(){
  	//alert('hi');
  	$('#form_login').css('display','none');
  	$('#form_forget_pass').css('display','block');
  });

  // $('body').on('click','.btn_social',function(){
  // 	var _social_auth=$(this).attr('data-social_id');
  // 	$.ajax({
  // 		type:'POST',
  // 		url:base_url+'slogin',
  // 		data:{_social_auth:_social_auth,csrf_test_name:csrf_hash},
  // 		beforeSend:function(){
  //         $('#btn_gauth').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
  //       },
  // 		success:function(d){
  // 			if(d.auth_url){
  // 				window.location.href=d.auth_url;
  // 			}
  // 		}
  // 	});
  // });

  function sauth(_social_auth,btn){
    $.ajax({
      type:'GET',
      url:base_url+'slogin?_social_auth='+_social_auth,
      data:{},
      beforeSend:function(){
        if(_social_auth=='fbauth'){
          $('#'+btn).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> FACEBOOK').prop('disabled',true);
        }else if(_social_auth=='gauth'){
          $('#'+btn).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> GOOGLE').prop('disabled',true);
        }
      },
      success:function(d){
        if(d.auth_url){
          window.location.href=d.auth_url;
        }
      }
    });
  }

  $('body').on('click','#btn_gauth',function(){
    var _social_auth=$(this).attr('data-social_id');
    sauth(_social_auth,'btn_gauth');
  });

  $('body').on('click','#btn_gauthr',function(){
    var _social_auth=$(this).attr('data-social_id');
    sauth(_social_auth,'btn_gauthr');
  });

  $('body').on('click','#btn_fbauth',function(){
    var _social_auth=$(this).attr('data-social_id');
    sauth(_social_auth,'btn_fbauth');
  });


	$('#logRegModal').on('show.bs.modal', function () {
	  $('#logRegModal').find('#form_register').val(curl);
	   // $("#register_user_country").chosen({no_results_text: "Select Country"});
	  //$("#register_country").trigger("chosen:updated");
	});


	$('#logModal').on('show.bs.modal', function () {
		//alert(curl);
	  $('#logModal').find('#form_login #user_curl').val(curl);

	});
});