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

  if($('#registration_dob').length>0){
    $('#registration_dob').datepicker({
        format: 'dd-mm-yyyy'
    });
  }


  if($('.passing_year').length>0){
    $('.passing_year').datepicker({
      format: 'yyyy',
      viewMode: "years", 
      minViewMode: "years",
      endDate: '+0d',
      autoclose: true
    });
  }

  $("#registration_profile_country").chosen({no_results_text: "Select Country"});
  $('#registration_profile_state').chosen({no_results_text: "Select State"});
  $('#registration_profile_district').chosen({no_results_text: "Select District"});
  $('#registration_profile_city').chosen({no_results_text: "Select City"});
  

  $('body').on('change','#registration_profile_country',function(){
    var ccode=$('#registration_profile_country :selected').val();
    loadstates(ccode);

    // if(ccode!=''){
    //   $('#register_student_country-error').html('').css('display','none');
    // }
  });

  $('body').on('change','#registration_profile_state',function(){

      var ccode=$('#registration_profile_country :selected').val();
      var state=$('#registration_profile_state :selected').val();
  
      loadcities(ccode,state);
      //loadDistricts(country,state);
      $("#register_student_city").trigger("chosen:updated");
      if(state!=''){
        $('#registration_state-error').html('').css('display','none');
      }
  });

  $(".student_courses").chosen('destroy');

  $(".student_courses").chosen({no_results_text: "Select Course .....",include_group_label_in_selected:true});

    $.getJSON(base_url+'get_courses',function(data){
      //console.log(data.searched_data);
      var json_data=data.searched_data;
      var course_html='';
      $.each(json_data,function(k,v){
        course_html+='<option value="0">Select Course</option>';
        course_html+='<optgroup label="'+k+'">';
        $.each(v,function(_k,_v){
          course_html+='<option value="'+_v.course_id+'" '+_v.selected+'>'+_v.course_name+' [ '+_v.course_short_name+' ]</option>';
        });
          
          course_html+='</optgroup>';
         });

      localStorage.setItem('course_html',course_html);

         $('.student_courses').html(course_html);
         $(".student_courses").trigger("chosen:updated");
    });


  function loadstates(c){
    var shtml='<option value="0">Select State/Province</option>';

    $.ajax({
      type:'GET',
      url:base_url+'get_states/'+c,
      data:{},
      beforeSend: function(){ 
        $("#registration_state").empty(); 
      },
      success:function(d){
        $.each(d,function(k,v){
          shtml+='<option value="'+v.state_id+'">'+v.state_name+'</option>';
        });
        
        $('#registration_profile_state').html(shtml);

        //console.log('state:'+d[0]['state_id']);

       $("#registration_profile_state").trigger("chosen:updated");
       //loadcities(c,d[0]['state_id']);
      }
    });
  }

    function loadcities(c,s){
      var chtml='<option value="0">Select City</option>';

      $.ajax({
        type:'GET',
        url:base_url+'get_cities/'+c+'/'+s,
        data:{},
        beforeSend: function(){ 
          $("#register_student_city").empty(); 
        },
        success:function(d){
          $.each(d,function(k,v){
            chtml+='<option value="'+v.city_id+'">'+v.city_name+'</option>';
          });
          
          $('#registration_profile_city').html(chtml);

         $("#registration_profile_city").trigger("chosen:updated");
        }
      });
    }


    function loadDistricts(c,s){
      var chtml='<option value="0">Select District</option>';

      $.ajax({
        type:'GET',
        url:wb_api+'coapi/districts/'+c+'/'+s,
        data:{},
        beforeSend: function(){ 
          $("#registration_district").empty(); 
        },
        success:function(data){
          if(data.status==false){
            chtml+='<option value="0">No District Found</option>';
          }else{
            json_data=data.districts;
            chtml='<option value="0">Select District</option>';

            $.each(json_data,function(k,v){
              chtml+='<option value="'+v.district_id+'">'+v.district_name+'</option>';
            });
          }
          
          $('#registration_district').html(chtml);

         $("#registration_district").trigger("chosen:updated");
        }
      });
    }


    $(document).on("focusin", ".passing_year", function() {
       $(this).prop('readonly', true);  
    });

    $(document).on("focusout", ".passing_year", function() {
       $(this).prop('readonly', false); 
    });

    $('body').on('focus',".passing_year", function(){
      $(this).datepicker({
          format: 'yyyy',
          viewMode: "years", 
          minViewMode: "years",
          endDate: '+0d',
          autoclose: true
        });
    });


  $('#form_student_acc_settings').validate({
    rules:{
      registration_user_recovery_mail:{
        email:true
      },
      registration_user_current_pass:{
        pwcheck:true
      },
      registration_user_new_pass:{
        pwcheck:true
      }
    },
    messages:{
      registration_user_recovery_mail:{
        email:'Email is not valid'
      }
    },
    submitHandler:function(){
      var formData=new FormData($('#form_student_acc_settings')[0]);
      formData.append([csrf_name], csrf_hash);
      formData.append('change_type', 'account_settings');
      $.ajax({
          type:'POST',
          url:base_url+'update_single',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_account_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_update_account_info').prop('disabled',true);
             Toast.fire({
                icon: 'success',
                title: f.success
              });            
            }else if(f.error){
              $('#btn_update_account_info').prop('disabled',true);
              Toast.fire({
                icon: 'error',
                title: f.error,
              });
            }else if(f.redirect){
              $('#btn_update_account_info').prop('disabled',true);
              Toast.fire({
                icon: 'info',
                title: 'Your session expired'
              });
            }
          },
          xhr: function(){
              //Get XmlHttpRequest object
               var xhr = $.ajaxSettings.xhr() ;
              //Set onprogress event handler
               xhr.upload.onprogress = function(data){
                  var perc =(data.loaded / data.total) * 100;// Math.round((data.loaded / data.total) * 100);
                  $('.progress-bar').css('width',perc.toFixed(2) + '%').text(perc.toFixed(2) + '%');
               };
               return xhr ;
          },
          error: function (e) {
          },
          complete:function(status,xhr){
            $('.progress-bar').css('width', '0%').text('0%');
            $('#registration_user_current_pass').val('');
            $('#registration_user_new_pass').val('');
            $('#btn_update_account_info').html('Update').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });

  $('#from_student_basic_details').validate({
    rules:{
      registration_full_name:{
        required:true
      },
      registration_email:{
        required:true,
        email:true
      },
      registration_phone_no:{
        required:true,
        digits:true,
        minlength:10,
        maxlength:12
      },
      registration_alternate_phone_no:{
        digits:true,
        minlength:10,
        maxlength:12
      },
      registration_gender:{
        required:true
      },
      registration_dob:{
        required:true
      },
      registration_yop:{
        required:true,
        digits:true,
        minlength:4,
        maxlength:4
      },
      registration_country:{
        valueNotEquals:'0'
      },
      registration_state:{
        valueNotEquals:'0'
      },
      registration_city:{
        valueNotEquals:'0'
      },
      registration_zipcode:{
        required:true,
        digits:true
      },
      registration_address:{
        required:true
      },
      registration_about_yourself:{
        minlength:30,
        maxlength:300
      }
    },
    messages:{
      registration_full_name:{
        required:'Enter fullname'
      },
      registration_email:{
        required:'Enter valid email address',
        email:'Email address is npot valid'
      },
      registration_phone_no:{
        required:'Enter valid phone no.',
        digits:'Only numeric vallue allowed',
        minlength:'Minimum 10 digits required',
        maxlength:'Maximum 12 digits are allowed'
      },
      registration_alternate_phone_no:{
        digits:'Only numeric vallue allowed',
        minlength:'Minimum 10 digits required',
        maxlength:'Maximum 12 digits are allowed'
      },
      registration_gender:{
        required:'Select gender'
      },
      registration_dob:{
        required:'Enter DOB'
      },
      registration_yop:{
        required:'Enter year of passing',
        digits:'Only numeric value allowed',
        minlength:'Mimimum 4 digits required',
        maxlength:'Maximum 4 digits are allowed'
      },
      registration_country:{
        valueNotEquals:'Select country you live in'
      },
      registration_state:{
        valueNotEquals:'Select State/Province'
      },
      registration_city:{
        valueNotEquals:'Select city'
      },
      registration_zipcode:{
        required:'Enter zipcode',
        digits:'Only numeric value allowed'
      },
      registration_address:{
        required:'Enter your current address'
      },
      registration_about_yourself:{
        minlength:'Minimum 30 charachters required',
        maxlength:'Maximum 300 charachters are allowed'
      }
    },
    submitHandler:function(){
      var formData=new FormData($('#from_student_basic_details')[0]);
      formData.append([csrf_name], csrf_hash);
      formData.append('change_type', 'basic_info_change');
      formData.append('dutyp', 'basic_details');
      $.ajax({
          type:'POST',
          url:base_url+'update_single',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_stubasic_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_update_stubasic_info').prop('disabled',true);
             Toast.fire({
                icon: 'success',
                title: f.success
              });            
            }else if(f.error){
              $('#btn_update_stubasic_info').prop('disabled',true);
              Toast.fire({
                icon: 'error',
                title: f.error,
              });
            }else if(f.redirect){
              $('#btn_update_stubasic_info').prop('disabled',true);
              Toast.fire({
                icon: 'info',
                title: 'Your session expired'
              });
            }
          },
          xhr: function(){
              //Get XmlHttpRequest object
               var xhr = $.ajaxSettings.xhr() ;
              //Set onprogress event handler
               xhr.upload.onprogress = function(data){
                  var perc =(data.loaded / data.total) * 100;// Math.round((data.loaded / data.total) * 100);
                  $('.progress-bar').css('width',perc.toFixed(2) + '%').text(perc.toFixed(2) + '%');
               };
               return xhr ;
          },
          error: function (e) {
          },
          complete:function(status,xhr){
            $('.progress-bar').css('width', '0%').text('0%');
            $('#btn_update_stubasic_info').html('Update').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('#from_student_high_school_details').validate({
    rules:{
      registration_10_pass_year:{
        required:true,
        digits:true,
        minlength:4,
        maxlength:4
      },
      registration_10th_grade:{
        valueNotEquals:'0',
      },
      registration_10_pass_marks:{
        required:true,
        digits:true,
        maxlength:3
      },
      registration_12_pass_year:{
        required:true,
        digits:true,
        minlength:4,
        maxlength:4
      },
      registration_12th_grade:{
        valueNotEquals:'0',
      },
      registration_12_pass_marks:{
        required:true,
        digits:true,
        maxlength:3
      },
      registration_grad_pass_year:{
        digits:true,
        minlength:4,
        maxlength:4
      },
      registration_grad_pass_marks:{
        digits:true,
        maxlength:3
      },
      registration_about_edu:{
        required:true,
        minlength:50,
        maxlength:300
      }
    },
    messages:{
      registration_10_pass_year:{
        required:'Select 10th passing year'
      },
      registration_10_pass_marks:{
        required:'Enter marks',
        digits:'Only numeric value allowed',
      },
      registration_12_pass_marks:{
        required:'Enter marks',
        digits:'Only numeric value allowed',
      },
      registration_grad_pass_marks:{
        digits:'Only numeric value allowed',
      },
      registration_about_edu:{
        required:'Provide brief about yourself',
        minlength:50,
        maxlength:300
      }
    },
    submitHandler:function(){
      var formData=new FormData($('#from_student_high_school_details')[0]);
      formData.append([csrf_name], csrf_hash);
      formData.append('change_type', 'basic_info_change');
      formData.append('dutyp', 'high_school_details');
      $.ajax({
          type:'POST',
          url:base_url+'update_single',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_highschool_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_update_highschool_info').prop('disabled',true);
             Toast.fire({
                icon: 'success',
                title: f.success
              });            
            }else if(f.error){
              $('#btn_update_highschool_info').prop('disabled',true);
              Toast.fire({
                icon: 'error',
                title: f.error,
              });
            }else if(f.redirect){
              $('#btn_update_highschool_info').prop('disabled',true);
              Toast.fire({
                icon: 'info',
                title: 'Your session expired'
              });
            }
          },
          xhr: function(){
              //Get XmlHttpRequest object
               var xhr = $.ajaxSettings.xhr() ;
              //Set onprogress event handler
               xhr.upload.onprogress = function(data){
                  var perc =(data.loaded / data.total) * 100;// Math.round((data.loaded / data.total) * 100);
                  $('.progress-bar').css('width',perc.toFixed(2) + '%').text(perc.toFixed(2) + '%');
               };
               return xhr ;
          },
          error: function (e) {
          },
          complete:function(status,xhr){
            $('.progress-bar').css('width', '0%').text('0%');
            $('#btn_update_highschool_info').html('Update').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('#from_student_higher_edu_details').validate({
    submitHandler:function(){
      var formData=new FormData($('#from_student_higher_edu_details')[0]);
      formData.append([csrf_name], csrf_hash);
      formData.append('dutyp', 'higher_edu_details');
      formData.append('change_type', 'basic_info_change');
      $.ajax({
          type:'POST',
          url:base_url+'update_single',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_higher_edu_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_update_higher_edu_info').prop('disabled',true);
             Toast.fire({
                icon: 'success',
                title: f.success
              });            
            }else if(f.error){
              $('#btn_update_higher_edu_info').prop('disabled',true);
              Toast.fire({
                icon: 'error',
                title: f.error,
              });
            }else if(f.redirect){
              $('#btn_update_higher_edu_info').prop('disabled',true);
              Toast.fire({
                icon: 'info',
                title: 'Your session expired'
              });
            }
          },
          xhr: function(){
              //Get XmlHttpRequest object
               var xhr = $.ajaxSettings.xhr() ;
              //Set onprogress event handler
               xhr.upload.onprogress = function(data){
                  var perc =(data.loaded / data.total) * 100;// Math.round((data.loaded / data.total) * 100);
                  $('.progress-bar').css('width',perc.toFixed(2) + '%').text(perc.toFixed(2) + '%');
               };
               return xhr ;
          },
          error: function (e) {
          },
          complete:function(status,xhr){
            $('.progress-bar').css('width', '0%').text('0%');
            $('#btn_update_higher_edu_info').html('Update').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('#from_student_prof_exp_details').validate({
    rules:{

    },
    messages:{

    },
    submitHandler:function(){
      var formData=new FormData($('#from_student_prof_exp_details')[0]);
      formData.append([csrf_name], csrf_hash);
      formData.append('dutyp', 'prof_exp_details');
      formData.append('change_type', 'basic_info_change');
      $.ajax({
        type:'POST',
        url:base_url+'update_single',
        data:formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        target: '.preview',
        beforeSend:function(){
            $('#btn_update_prof_exp_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
        },
        success:function(f){
          if(f.success){
           $('#btn_update_prof_exp_info').prop('disabled',true);
           Toast.fire({
              icon: 'success',
              title: f.success
            });            
          }else if(f.error){
            $('#btn_update_prof_exp_info').prop('disabled',true);
            Toast.fire({
              icon: 'error',
              title: f.error,
            });
          }else if(f.redirect){
            $('#btn_update_prof_exp_info').prop('disabled',true);
            Toast.fire({
              icon: 'info',
              title: 'Your session expired'
            });
          }
        }
      });
    }
  });


  $('body').on('click','#btn_higher_edu_row',function(){


       $(".student_courses").chosen('destroy');

  

    var hedu_html='';

    hedu_html+='<div class="row" id="row'+higher_edu_row+'">';
            hedu_html+='<div class="form-group col-sm-6">';
                    hedu_html+='<label>Select Course </label>';
                    hedu_html+='<select class="form-control student_courses" name="higher_edu['+higher_edu_row+'][course]"  id="higher_edu_'+higher_edu_row+'_course">';
                      hedu_html+=localStorage.getItem('course_html');
                    hedu_html+='</select>';

                hedu_html+='</div>';
                hedu_html+='<div class="form-group col-sm-3">';
                      hedu_html+='<label>Year Interested </label>';
                      hedu_html+='<input type="text" class="form-control passing_year" id="higher_edu_'+higher_edu_row+'_year" name="higher_edu['+higher_edu_row+'][year]" aria-describedby="higher_edu_'+higher_edu_row+'_year" placeholder="Year Interested" value="">';
                  hedu_html+='</div>';
                  hedu_html+='<div class="form-group col-sm-3">';
                    hedu_html+='<label>Mode </label>';
                    hedu_html+='<select class="form-control" name="higher_edu['+higher_edu_row+'][mode]">';
                      hedu_html+='<option value="0">Select Mode</option>';
                      
                      $.each (course_program_type,function(i,v) {
                        hedu_html+='<option value="'+v.program_type_id+'">'+v.program_type_name+'</option>';
                      });
                      
                    hedu_html+='</select>';
                    hedu_html+='<button type="button" class="btn btn-sm btn-danger" style="float:right;" onclick="$(\'#row' + higher_edu_row + '\').remove()">Remove</button>';
                hedu_html+='</div>';
            hedu_html+='</div>';

        higher_edu_row++;



        $('#hedu_body').append(hedu_html);

        $(".student_courses").chosen({no_results_text: "Select Course .....",include_group_label_in_selected:true});
        $("#higher_edu_"+higher_edu_row+"_course").trigger("chosen:updated");


  });


  $(".companies").chosen('destroy');

  $(".companies").chosen({no_results_text: "Select Company .....",include_group_label_in_selected:true});

    $.getJSON(base_url+'get_companies',function(data){
      //console.log(data.searched_data);
      var json_data=data.searched_data;
      var company_html='';

        company_html+='<option value="0">Select Company</option>';
        $.each(json_data,function(_k,_v){
          company_html+='<option value="'+_v.company_id+'" '+_v.selected+'>'+_v.company_name+'</option>';
        });
        company_html+='<option value="Other">Other</option>';

      localStorage.setItem('company_html',company_html);

         $('.companies').html(company_html);
         $(".companies").trigger("chosen:updated");
    });



  $('body').on('click','#btn_add_company',function(){
      var prof_exp_html='';

      //console.log(years);


      prof_exp_html+='<div class="row prof_exp_row'+prof_exp_row+'">';
      prof_exp_html+='<hr>';
            prof_exp_html+='<div class="form-group col-sm-12">';
                    prof_exp_html+='<label>Select A Company </label>';
                    prof_exp_html+='<button type="button" class="btn btn-sm btn-danger" style="float:right;" onclick="$(\'.prof_exp_row' + prof_exp_row + '\').remove()">Remove</button>';
                    prof_exp_html+='<select class="form-control companies" name="prof_exp['+prof_exp_row+'][company]" id="prof_exp_'+higher_edu_row+'_company">';
                      prof_exp_html+='<option value="0">Select Company</option>';
                      prof_exp_html+=localStorage.getItem('company_html');
                    prof_exp_html+='</select>';
                prof_exp_html+='</div>';
            prof_exp_html+='</div>';
            prof_exp_html+='<div class="row prof_exp_row'+prof_exp_row+'" style="display:none;">';
              prof_exp_html+='<div class="form-group col-sm-12">';
                prof_exp_html+='<label>Other Company</label>';
                prof_exp_html+='<input type="text" name="prof_exp['+prof_exp_row+'][other_company]" class="form-control">';
              prof_exp_html+='</div>';
            prof_exp_html+='</div>';
            prof_exp_html+='<div class="row prof_exp_row'+prof_exp_row+'">';
                prof_exp_html+='<div class="form-group col-sm-12">';
                      prof_exp_html+='<label>Work Exprerience (in Years) </label>';
                      prof_exp_html+='<select class="form-control" name="prof_exp['+prof_exp_row+'][exp_year]">';
                      prof_exp_html+='<option value="0">Select Experience</option>';
                      prof_exp_html+=years_row;
                    prof_exp_html+='</select>';
                  prof_exp_html+='</div>';
              prof_exp_html+='</div>';
              prof_exp_html+='<div class="row prof_exp_row'+prof_exp_row+'">';
                  prof_exp_html+='<div class="form-group col-sm-12">';
                    prof_exp_html+='<label>Specialization </label>';
                    prof_exp_html+='<textarea class="form-control"  name="prof_exp['+prof_exp_row+'][specialization]" placeholder="Specialization" rows="3"></textarea>';
                prof_exp_html+='</div>';
                 
            prof_exp_html+='</div>';


        prof_exp_row++;



    $('#prof_exp_div').append(prof_exp_html);

    $(".companies").chosen({no_results_text: "Select Company .....",include_group_label_in_selected:true});
    $("#prof_exp_"+prof_exp_row+"_company").trigger("chosen:updated");
  });



  $(document).on("change", ".uploadProfileInput", function () {
    var triggerInput = this;
    var currentImg = $(this).closest(".pic-holder").find(".pic").attr("src");
    var holder = $(this).closest(".pic-holder");
    var wrapper = $(this).closest(".profile-pic-wrapper");
    $(wrapper).find('[role="alert"]').remove();
    var files = !!this.files ? this.files : [];
    if (!files.length || !window.FileReader) {
      return;
    }
    if (/^image/.test(files[0].type)) {
      // only image file
      var reader = new FileReader(); // instance of the FileReader
      reader.readAsDataURL(files[0]); // read the local file

      reader.onloadend = function () {
        $(holder).addClass("uploadInProgress");
        $(holder).find(".pic").attr("src", this.result);
        $(holder).append(
          '<div class="upload-loader"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>'
        );

        // Dummy timeout; call API or AJAX below
        // setTimeout(() => {
        //   $(holder).removeClass("uploadInProgress");
        //   $(holder).find(".upload-loader").remove();
        //   // If upload successful
        //   if (Math.random() < 0.9) {
        //     $(wrapper).append(
        //       '<div class="snackbar show" role="alert"><i class="fa fa-check-circle text-success"></i> Profile image updated successfully</div>'
        //     );

        //     // Clear input after upload
        //     $(triggerInput).val("");

        //     setTimeout(() => {
        //       $(wrapper).find('[role="alert"]').remove();
        //     }, 3000);
        //   } else {
        //     $(holder).find(".pic").attr("src", currentImg);
        //     $(wrapper).append(
        //       '<div class="snackbar show" role="alert"><i class="fa fa-times-circle text-danger"></i> There is an error while uploading! Please try again later.</div>'
        //     );

        //     // Clear input after upload
        //     $(triggerInput).val("");
        //     setTimeout(() => {
        //       $(wrapper).find('[role="alert"]').remove();
        //     }, 3000);
        //   }
        // }, 1500);


        setTimeout(() => {

          var formData=new FormData($('#form_user_image')[0]);

          formData.append([csrf_name], csrf_hash);
          formData.append('change_type', 'basic_info_change');
          formData.append('dutyp', 'profile_image');

          $.ajax({
            type:'POST',
            url:base_url+'update_single',
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            success:function(f){
              if(f.success){
                $(wrapper).append(
                  '<div class="snackbar show" role="alert"><i class="fa fa-check-circle text-success"></i> Profile image updated successfully</div>'
                );
                $(triggerInput).val("");
                setTimeout(() => {
                  $(wrapper).find('[role="alert"]').remove();
                }, 3000);
              }else if(f.error){
                $(holder).find(".pic").attr("src", currentImg);
                $(wrapper).append(
                  '<div class="snackbar show" role="alert"><i class="fa fa-times-circle text-danger"></i> There is an error while uploading! Please try again later.</div>'
                );
                $(triggerInput).val("");
                setTimeout(() => {
                  $(wrapper).find('[role="alert"]').remove();
                }, 3000);
              }
            },
            complete:function(xhr,status){
              $(holder).removeClass("uploadInProgress");
              $(holder).find(".upload-loader").remove();
              // Clear input after upload
              $(triggerInput).val("");
              setTimeout(() => {
                $(wrapper).find('[role="alert"]').remove();
              }, 3000);

            }
          });

        }, 1500);


      };
    } else {
      $(wrapper).append(
        '<div class="alert alert-danger d-inline-block p-2 small" role="alert">Please choose the valid image.</div>'
      );
      setTimeout(() => {
        $(wrapper).find('role="alert"').remove();
      }, 3000);
    }
  });

});