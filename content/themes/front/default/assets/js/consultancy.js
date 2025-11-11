jQuery(function($) {
  "use strict";

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 10000
  });

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");

  $('#form_consultant_register').validate({
    rules:{
      register_course:{
        required:true,
        valueNotEquals:'0'
      },
      registration_name:{
        required:true
      },
      registration_contact_person_name:{
        required:true
      },
      registration_email:{
        required:true,
        email:true
      },
      registration_phone_no:{
        required:true
      },
      registration_contact_person_phone_no:{
        required:true
      },
      registration_state:{
        valueNotEquals:'0'
      },
      registration_city:{
        valueNotEquals:'0'
      },
      registration_pincode:{
        required:true
      },
      registration_address:{
        required:true
      }
    },
    messages:{
      register_course:{
        required:'Please Select Course',
        valueNotEquals:'Please Select Course'
      },
      registration_name:{
        required:'Please enter bussiness name'
      },
      registration_contact_person_name:{
        required:'Please enter contact person name'
      },
      registration_email:{
        required:'Please enter bussiness email',
        email:'Email is not valid'
      },
      registration_phone_no:{
        required:'Please enter phone'
      },
      registration_contact_person_phone_no:{
        required:'Please enter contact person phone no.'
      },
      registration_state:{
        valueNotEquals:'please select state'
      },
      registration_city:{
        valueNotEquals:'Please select city'
      },
      registration_pincode:{
        required:'Please enter pincode'
      },
      registration_address:{
        required:'Please enter valid address'
      }
    },
    submitHandler:function(){
      var ph=$('#form_consultant_register').find('#registration_phone_no').val();
      var f_data = FormDataJson.formToJson(document.getElementById("form_consultant_register"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      $.ajax({
        type:'POST',
        url:base_url+'register_consultancy',
        data: {ctext:ctext,csrf_test_name:csrf_hash},
        cache:false,
        beforeSend:function(){
          // $('#registration_name').prop('disabled',true);
          // $('#registration_email').prop('disabled',true);
          // $('#registration_phone_no').prop('disabled',true);
          // $('#registration_password').prop('disabled',true)
          $('#btn_consultant_account').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
              $('#btn_consultant_account').html('Register').prop('disabled',false);

              $('#form_consultant_register')[0].reset();
              $('#form_consultant_register').find('#csrf_test_name').val(csrf_hash);
              $('#form_account_otp_verification').find('#registration_phone_no').val(ph);
              $('#form_consultant_register').css('display','none');
              $('#form_account_otp_verification').css('display','block');
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
            $('#btn_consultant_account').html('Register').prop('disabled',false);
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
            $('#btn_create_account').html('Register').prop('disabled',false);
        },
        complete:function(status,xhr){
         // $('#btn_submit').html('Sign In');
        }
      });
    }
  });

  $('#form_account_otp_verification').validate({
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
        required:'Please enter 6 digit OTP',
        number:'Only numbers allowed',
        minlength:'OTP invalid',
        maxlength:'OTP invalid'
      }
    },
    submitHandler:function(){
      var f_data = FormDataJson.formToJson(document.getElementById("form_account_otp_verification"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      $.ajax({
        type:'POST',
        url:base_url+'register_consultancy',
        data: {ctext:ctext,csrf_test_name:csrf_hash},
        cache:false,
        beforeSend:function(){
          $('#btn_consultant_account_verify').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d,status,xhr){
          //alert(d.error);
          if(d.success){
            //setTimeout(function(){
              Toast.fire({
                icon: 'success',
                title: d.success
              });
              $('#btn_consultant_account_verify').html('Verify').prop('disabled',false);

              $('#form_account_otp_verification')[0].reset();
              $('#form_account_otp_verification').find('#csrf_test_name').val(csrf_hash);
              $('#form_consultant_register').css('display','block');
              $('#form_account_otp_verification').css('display','none');
            //},1200);              
          }else if(d.error){
            Toast.fire({
                icon: 'error',
                title: d.error
            });
            $('#btn_consultant_account_verify').html('Verify').prop('disabled',false);
          }
        },
        error: function( jqXhr ) {
          if( jqXhr.status == 400 ) {
            window.location.reload();
          }else if( jqXhr.status == 403 ) {
            window.location.reload();
          }
          $('#btn_consultant_account_verify').html('Create Account').prop('disabled',false);
        },
        complete:function(status,xhr){
         // $('#btn_submit').html('Sign In');
        }
      });
    }
  });


  $("#register_course").chosen({no_results_text: "Select Course .....",include_group_label_in_selected:true});
  $("#registration_city").chosen({no_results_text: "Select City .....",include_group_label_in_selected:true});
   $("#registration_state").chosen({no_results_text: "Select State .....",include_group_label_in_selected:true});

  $('body').on('change','#registration_state',function(){
    var state=$('#registration_state :selected').val();
    var html='';
    $.ajax({
      type:'GET',
      url:'https://api.waytoadmissions.com/v1/coapi/state_cities/99/'+state,
      data:{},
      success:function(d){
        if(d.searched_data!=''){
          $.each(d.searched_data,function(k,v){            
            html+='<option value="'+v['city_id']+'">'+v['city_name']+'</option>';
          });
        }else{
          html=html;
        }

        $('#registration_city').html(html);
        $("#registration_city").trigger("chosen:updated");
      }
    });

  });

  $.getJSON('https://api.waytoadmissions.com/v1/capi/courses_filters/_searched_param/1',function(data){
      var json_data=data.searched_data;
      var course_html='';
      $.each(json_data,function(k,v){
        course_html+='<optgroup label="'+k+'">';
        $.each(v,function(_k,_v){
          course_html+='<option value="'+_v.course_id+'">'+_v.course_name+' [ '+_v.course_short_name+' ]</option>';
        });
          
          course_html+='</optgroup>';
         });

         $('#register_course').html(course_html);
         $("#register_course").trigger("chosen:updated");
  });

  function phone_validate(phno) 
  { 
    var regexPattern=new RegExp(/^[0-9-+]+$/);    // regular expression pattern
    return regexPattern.test(phno); 
  }

  $('body').on('click','#btn_send_otp',function(){
    var ph_no=$('#registration_contact_person_phone_no').val();

    if(ph_no!=''){

      if(phone_validate(ph_no)){
        $.ajax({
          type:'POST',
          url:base_url+'send_otp',
          data:{ph_no:ph_no,csrf_test_name:csrf_hash},
          beforeSend:function(){
            $('#btn_send_otp').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(d){
            if(d.success){
              Toast.fire({
                icon: 'success',
                title: d.success
              });
              $('#btn_send_otp').html('Send OTP').prop('disabled',false);
            }else{
              Toast.fire({
                icon: 'error',
                title: d.error
              });

              $('#btn_send_otp').html('Send OTP').prop('disabled',false);
            }
          }
        });
      }else{
        Toast.fire({
          icon: 'error',
          title: 'Please enter a valid phone no.'
        });
      }
        
    }else{
      Toast.fire({
        icon: 'error',
        title: 'Please enter phone no.'
      });

      $('#registration_contact_person_phone_no').focus();
    }
     
  });


});