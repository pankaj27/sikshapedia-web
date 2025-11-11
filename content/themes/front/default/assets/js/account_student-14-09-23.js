jQuery(function($) {
  "use strict";

  jQuery.validator.addMethod("pwcheck", function (value, element) {
    return this.optional(element) || /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
  }, "Password must contain atleast one digit , one lowercase letter , one uppercase letter and one special character(!@#$%^&)");

  jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
  }, "Letters, numbers, and underscores only please");

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");

  $.validator.addMethod("alpha", function(value, element) {
      return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
  });


  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 10000
  });



  $("#register_student_country").chosen({no_results_text: "Select Country"});
  $("#register_student_state").chosen({no_results_text: "Select State/Province"});
  $("#register_student_district").chosen({no_results_text: "Select District"});
  $("#register_student_city").chosen({no_results_text: "Select City"});
  $("#register_student_course").chosen({no_results_text: "Select Course"});


  setTimeout(function(){

    var html='<option value="0">Select Country</option>';
    $.ajax({
      type:'GET',
      url:wb_api+'coapi/countries/yes',
      data:{},
      beforeSend: function(){ 
        $("#register_college_country").empty(); 
      },
      success:function(d){
        $.each(d,function(k,v){
          html+='<option value="'+v['country_id']+'#'+v['country_code']+'" data-ccode="'+v['country_code']+'">'+v['country_name']+'</option>';
        });
        
        $('#register_student_country').html(html);

       $("#register_student_country").trigger("chosen:updated");

       loadstates($("#register_student_state :selected").val());
       $("#register_student_state").trigger("chosen:updated");

      }
    });


    $.getJSON(base_url+'get_courses',function(data){
      json_data=data.searched_data;
      var course_html='';
      $.each(json_data,function(k,v){
        course_html+='<optgroup label="'+k+'">';
        $.each(v,function(_k,_v){
          course_html+='<option value="'+_v.course_id+'">'+_v.course_name+' [ '+_v.course_short_name+' ]</option>';
        });
          
          course_html+='</optgroup>';
         });

         $('#register_student_course').html(course_html);
         $("#register_student_course").trigger("chosen:updated");
    });
  },1000);


    $('body').on('change','#register_student_country',function(){
      var ccode=$('#register_student_country :selected').val();
      const myArr = ccode.split("#");
      var country=myArr[0];
      $('#label_ph').html('Phone No ('+myArr[1]+')');
      
      console.log(myArr[1]);
      loadstates(country);

      if(ccode!=''){
        $('#register_student_country-error').html('').css('display','none');
      }
    });

    $('body').on('change','#register_student_state',function(){

      var ccode=$('#register_student_country :selected').val();
      const myArr = ccode.split("#");
      var country=myArr[0];
      var state=$('#register_student_state :selected').val();
      console.log(state);
      loadcities(country,state);
      $("#register_student_city").trigger("chosen:updated");
      if(state!=''){
        $('#register_student_state-error').html('').css('display','none');
      }
    });

    $('body').on('change','#register_city',function(){
      var ses=$('#register_student_city :selected').val();

      if(ses!=''){
        $('#register_student_city-error').html('').css('display','none');
      }
    });


    function loadstates(c){
      var shtml='<option value="0">Select State/Province</option>';

      $.ajax({
        type:'GET',
        url:wb_api+'coapi/country_states/'+c,
        data:{},
        beforeSend: function(){ 
          $("#register_college_state").empty(); 
        },
        success:function(d){
          $.each(d.states,function(k,v){
            shtml+='<option value="'+v.state_id+'">'+v.state_name+'</option>';
          });
          
          $('#register_student_state').html(shtml);

          //console.log('state:'+d[0]['state_id']);

         $("#register_student_state").trigger("chosen:updated");
         //loadcities(c,d[0]['state_id']);
        }
      });
    }

    function loadcities(c,s){
      var chtml='<option value="0">Select City</option>';

      $.ajax({
        type:'GET',
        url:wb_api+'coapi/state_cities/'+c+'/'+s,
        data:{},
        beforeSend: function(){ 
          $("#register_student_city").empty(); 
        },
        success:function(d){
          $.each(d.cities,function(k,v){
            chtml+='<option value="'+v.city_id+'">'+v.city_name+'</option>';
          });
          
          $('#register_student_city').html(chtml);

         $("#register_student_city").trigger("chosen:updated");
        }
      });
    }



  let timerOn = true;

  function timer(remaining) {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;
    
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    document.getElementById('timer').innerHTML = 'Didn\'t receive the code? Request again in '+m + ':' + s;

    remaining -= 1;
    
    if(remaining >= 0 && timerOn) {
      setTimeout(function() {
          timer(remaining);
      }, 1000);
      return;
    }

    if(!timerOn) {
      // Do validate stuff here
      return;
    }
    
    // Do timeout stuff here

    $('#btn_otp_resend').css('display','block');
    
  }

  $('#form_student_verify_otp2').validate({
    rules:{
      register_ph_otp:{
        required:true,
        digits:true,
        minlength:6,
        maxlength:6
      }
    },
    messages:{
      register_ph_otp:{
        required:'Enter OTP sent to your mobile no.',
        digits:'Only numeric value allowed',
        minlength:'Minimum 6 digits required',
        maxlength:'Maximum 6 digits allowed'
      }
    },
    submitHandler:function(){
      var temp=localStorage.getItem("temp"); 
      var ph_otp=$('#register_ph_otp').val();
      //var email_otp=$('#register_email_otp').val();
      $.ajax({
        type:'POST',
        url:base_url+'verify_otp',
        data:{csrf_test_name:csrf_hash,temp:temp,register_ph_otp:ph_otp},
        beforeSend:function(){
          $('#btn_verify_otp').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d){
         if(d.success){
          $('#btn_verify_otp').html(d.success);
          $('#btn_otp_resend').css('display','none');
          setTimeout(function(){
            window.location.href=d.redirect;
          },1000);
          
         }else if(d.error){
          $('#register_msg').html('<div class="alert alert-error">'+d.error+'</div>').css('display','block');
          $('#btn_verify_otp').html('Verify').prop('disabled',false);
         }
        },
        complete:function(xhr,status){
          //$('#btn_verify_otp').html('Verify').prop('disabled',false);
        }
      });
    }
  });


  $.validator.setDefaults({ ignore: ":hidden:not(select)" })

  

  $.validator.setDefaults({
      ignore: []
  });

  $('#form_student_register').validate({
    validClass: "success",
    rules:{
      register_student_name:{
        required:true,
        minlength:5,
        alpha:true
      },
      register_student_email:{
        required:true,
        email:true,
        remote: {
          url: base_url+'checkval_available',
          type: "POST",
          async:true,
          dataType:"json",
          data: {
            csrf_test_name:csrf_hash,
            check_type:'email',
            check_value_of:'stu',
            check_value: function() {              
              return $('#form_student_register :input[name="register_student_email"]').val();
            }
          }
        }
      },
      register_student_phone_no:{
        required:true,
        digits:true,
        minlength:10,
        maxlength:12,
        remote: {
          url: base_url+'checkval_available',
          type: "POST",
          async:true,
          dataType:"json",
          data: {
            csrf_test_name:csrf_hash,
            check_type:'phone',
            check_value_of:'stu',
            check_value: function() {              
              return $('#form_student_register :input[name="register_student_phone_no"]').val();
            }
          }
        }
      },
      register_student_country:{
        required:true,
        valueNotEquals:'0'
      },
      register_student_state:{
        valueNotEquals:'0'
      },
      register_student_city:{
        valueNotEquals:'0'
      },
      register_student_username:{
        required:true,
        minlength:8,
        maxlength:32,
        alphanumeric:true,
        remote: {
          url: base_url+'checkval_available',
          type: "POST",
          async:true,
          dataType:"json",
          data: {
            csrf_test_name:csrf_hash,
            check_type:'username',
            check_value_of:'stu',
            check_value: function() {              
             return $('#form_student_register :input[name="register_student_username"]').val();
            }
          }
        }
      },
      register_student_password:{
        required:true,
        minlength:8,
        maxlength:16,
        pwcheck:true
      },
      register_conf_password:{
        equalTo: "#register_student_password"
      },
      agree_to_tc: {
        required: true,
        minlength: 1
      }
    },
    messages:{
      register_student_name:{
        required:'Please enter Name',
        minlength:'Name must contain atleast 5 characters',
        alpha:'Name can contain only alphabets and space.'
      },
      register_student_email:{
        required:'Please enter a valid email.',
        email:'Email is not valid',
        remote:jQuery.validator.format("{0} is already in use")
      },
      register_student_phone_no:{
        required:'Please enter phone no.',
        digits:'Only numeric value allowed',
        minlength:'Minimum 10 digits required.',
        maxlength:'Maximum 12 digits allowed.',
        remote:jQuery.validator.format("{0} is already in use")
      },
      register_student_country:{
        valueNotEquals:'Select Country'
      },
      register_student_state:{
        valueNotEquals:'Select State'
      },
      register_student_city:{
        valueNotEquals:'Select City'
      },
      register_student_username:{
        required:'Choose an Username',
        minlength:'Minimum 8 characters required',
        maxlength:'Maximum 32 characters allowed',
        remote:jQuery.validator.format("{0} is not available")
      },
      register_student_password:{
        required:'Please enter your password',
        minlength:'Minimum 8 characters required',
        maxlength:'Maximum 16 characters allowed'
      },
      agree_to_tc: {
        required: 'You have to accept the T&C',
        minlength: 'You have to accept the T&C'
      }
    },
    submitHandler:function(){
      $.ajax({
        type:"POST",
        url:base_url+'signup/student_signup',
        data:$('#form_student_register').serialize(),
        cache:false,
        beforeSend:function(){
          $('#btn_update_account').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d,status,xhr){
          //alert(d.error);
          if(d.success){
            //setTimeout(function(){
              // Toast.fire({
              //   icon: 'success',
              //   title: d.success
              // });

              $('#btn_update_account').html('Register').prop('disabled',true);

              $('#form_student_register')[0].reset();

              $('#form_student_register').find('#_token').val(d._token);
              $('#form_student_verify_otp2').find('#register_student_phone_no').val(d.contact_ph_no);
              //$('#form_student_verify_otp2').find('#register_student_email').val(d.contact_email);
              localStorage.setItem("temp", d.temp);
              localStorage.setItem("contact_ph_no", d.contact_ph_no);
              localStorage.setItem("contact_email", d.contact_email);
              localStorage.setItem("college_email", d.college_email);
              // $('#otp_label').html(d.success_msg_otp);
              // $('#registration_user').val(d.otp_user);
              $('#form_student_register').css('display','none');
              $('#form_student_verify_otp2').css('display','block');
              timer(30);
              $('#timer').css('display','block');
              $('#attempts_left').html('('+d.attempts_left+'/3 attempats left)');
              window.scrollTo(0, 0);
              //$('#regModal').modal('hide');
            //},1200); 

            $('#register_msg').html('<div class="alert alert-success">'+d.success+'</div>').css('display','block');             
          }else if(d.error){
            // Toast.fire({
            //     icon: 'error',
            //     title: d.error
            // });

            $('#register_msg').html('<div class="alert alert-danger">'+d.error+'</div>').css('display','block');
 
            $('#btn_update_account').html('Register').prop('disabled',false);
          }
        },
        error: function( jqXhr ) {
          if( jqXhr.status == 400 ) {
            window.location.reload();
          }else if( jqXhr.status == 403 ) {
            window.location.reload();
          }
       
          $('#btn_update_account').html('Register').prop('disabled',false);
        },
        complete:function(status,xhr){
         setTimeout(function(){
          //$('#register_msg').html('').css('display','none');
         },2000);

        }
      });
    }
  });



  $('body').on('click','#btn_otp_resend',function(){
    var temp=localStorage.getItem("temp"); 
    $.ajax({
      type:'POST',
      url:base_url+'resend_otp',
      data:{csrf_test_name:csrf_hash,temp:temp},
      beforeSend:function(){
        $('#btn_otp_resend').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
      },
      success:function(d){
        if(d.error){
          $('#timer').css('display','none');
          $('#attempts_left').html(d.error);
        }else{
          
          if(d.start_timer==true){
            timer(30);
            $('#attempts_left').html('('+d.attempts_left+'/3 attempats left)');
          }
        }
      },
      complete:function(xhr,status){
        $('#btn_otp_resend').html('Resend OTP').css('display','none');
        $('#btn_otp_resend').prop('disabled',false);
      }
    });
  });


  $("#agree_to_tc").click(function() {
    var checked_status = this.checked;
    if (checked_status == true) {
       $("#btn_update_account").removeAttr("disabled");
    } else {
       $("#btn_update_account").attr("disabled", "disabled");
    }
  });
 

});