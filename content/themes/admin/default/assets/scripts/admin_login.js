jQuery(function($) {
  'use strict';



  jQuery.validator.addMethod("pwcheck", function (value, element) {
    return this.optional(element) || /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
  }, "Password must contain atleast one digit , one lowercase letter , one uppercase letter and one special character(!@#$%^&)");



  $('#form_admin_login').validate({
    rules:{
      user_name:{
        required:true,
      },
      user_password:{
        required:true,
        minlength:8,
        maxlength:64,
        pwcheck:true
      }
    },
    messages:{
       user_name:{
        required:'Please enter your username',
      },
      user_password:{
        required:'Please enter your password',
        minlength:'Minimum 8 characters required',
        maxlength:'Maximum 64 characters allowed'
      }
    },
    errorPlacement: function(label, element) {
      label.addClass('mt-2 text-danger');
      label.insertAfter(element);
    },
    highlight: function(element, errorClass) {
      $(element).parent().addClass('has-danger')
      $(element).addClass('form-control-danger')
    },
    submitHandler:function(){
      
      var f_data = FormDataJson.formToJson(document.querySelector("form"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      $.ajax({
        type:'POST',
        url:base_url+'/adminlogin',
        data: {ctext:ctext,[csrf_name]:csrf_hash},
        beforeSend:function(){
          $('#user_name').prop('disabled',true);
          $('#user_password').prop('disabled',true);
          $('#button_login').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Validating...</span>').prop('disabled',true);
        },
        success:function(d,status,xhr){

          if(d.success){

            setTimeout(function(){               
              $('#button_login').html(d.success).prop('disabled',true);
              window.location.href=d.redirect;
            },1200);
            
          }else{
            Swal.fire({
              icon: 'error',
              title: d.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#d33',
              allowOutsideClick: false,
            });

            $('#user_name').prop('disabled',false);
            $('#user_password').prop('disabled',false);
            $('#button_login').html('Login').prop('disabled',false);
            //$('input["hidden"][name="csrf_test_name"]').val(d.hash);
          }
        },
        error: function( jqXhr ) {
          //alert(jqXhr)
          if( jqXhr.status == 400 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request url not found',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }else if( jqXhr.status == 403 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request is forbidden',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }

          $('#user_name').prop('disabled',false);
          $('#user_password').prop('disabled',false);


          $('#button_login').html('Login').prop('disabled',false);
        },
        complete:function(status,xhr){
         // $('#btn_submit').html('Sign In');
        }
      });
    }
  });

});