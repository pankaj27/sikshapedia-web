jQuery(function($) {
  "use strict";

  jQuery.validator.addMethod("pwcheck", function (value, element) {
    return this.optional(element) || /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
  }, "Password must contain atleast one digit , one lowercase letter , one uppercase letter and one special character(!@#$%^&)");

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");

  $.validator.setDefaults({ ignore: ":hidden:not(select)" })

  $.validator.setDefaults({
      ignore: []
  });

  $('#form_get_credentials').validate({
    rules:{
      register_phone_no:{
        required:true,
        digits:true,
        minlength:10,
        maxlength:10
      }
    },
    messages:{
      register_phone_no:{
        required:'Enter phone no.',
        digits:'Only numeric value allowed',
        minlength:'Minimum 10digits required',
        maxlength:'Maximum 10 digits allowed'
      }
    },
    submitHandler:function(){
      $.ajax({
        type:'POST',
        url:base_url+'getresetdata',
        data:{csrf_test_name:csrf_hash,register_account_type:$('#register_account_type').val(),register_phone_no:$('#register_phone_no').val(),register_email:$('#register_email').val(),send_type:'resetotp'},
        beforeSend:function(){
          $('#btn_reset_credentials').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d){
          if(d.success){
            $('#reset_msg').html('<div class="alert alert-success">'+d.success+'</div>').css('display','block');

            $('#btn_reset_credentials').prop('disabled',false).html('Submit');

            $('#form_get_credentials')[0].reset();
            $('#_token').val(d.token);
            $('#form_get_credentials_reset').css('display','block');
            $('#form_get_credentials').css('display','none');
          }else if(d.error){
            $('#reset_msg').html('<div class="alert alert-error">'+d.error+'</div>').css('display','block');
            $('#btn_reset_credentials').prop('disabled',false).html('Submit');
            $('#form_get_credentials_reset').css('display','none');
            $('#form_get_credentials').css('display','block');
          }           
        },
        complete:function(status,xhr){
          setTimeout(function(){
            $('#reset_msg').html('').css('display','none');
          },5000);
          $('#btn_reset_credentials').prop('disabled',false).html('Submit');
        }
      });
    }
  });

  $('#form_get_credentials_reset').validate({
    rules:{
      register_ph_otp:{
        required:true,
        digits:true,
        minlength:6,
        maxlength:6
      },
      register_new_pass:{
        required:true,
        minlength:8,
        maxlength:16,
        pwcheck:true
      },
      register_conf_new_pass:{
        equalTo: "#register_new_pass"
      }
    },
    messages:{
      register_ph_otp:{
        required:'Enter OTP',
        digits:'Only numeric value allowed',
        minlength:'Minimum 6 charachter required',
        maxlength:'Maximum 6 charachter allowed'
      },
      register_new_pass:{
        required:'Enter new password',
        minlength:'Minimum 8 charachetr required',
        maxlength:'Maximum 16 charachter allowed'
      },
      register_conf_new_pass:{
        equalTo: "Confirm Password not matched"
      }
    },
    submitHandler:function(){
      $.ajax({
        type:'POST',
        url:base_url+'resetcredentials',
        data:{[csrf_name]:csrf_hash,register_ph_otp:$('#register_ph_otp').val(),register_conf_new_pass:$('#register_conf_new_pass').val()},
        beforeSend:function(){
          $('#btn_verify_otp').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d){
          if(d.success){
            $('#reset_msg').html('<div class="alert alert-success">'+d.success+'</div>').css('display','block');

            $('#btn_verify_otp').prop('disabled',true).html('Redirecting');

            setTimeout(function(){
              window.location.href=d.redirect;
            },1200);

            $('#form_get_credentials_reset')[0].reset();
            $('#_token').val(d.token);
          }else if(d.error){
            $('#reset_msg').html('<div class="alert alert-danger">'+d.error+'</div>').css('display','block');
            $('#btn_verify_otp').prop('disabled',false).html('Verify & Reset');
          }
        },
        complete:function(xhr,status){
          // setTimeout(function(){
          //   $('#reset_msg').html('').css('display','none');
          // },5000);
        }
      });
    }
  });

});