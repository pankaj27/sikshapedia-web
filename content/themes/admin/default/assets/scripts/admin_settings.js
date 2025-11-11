jQuery(function($) {
  'use strict';

  jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
  }, "Letters, numbers, and underscores only please");

  $('#form_settings').validate({
  	rules:{
      system_meta_title:{
        required:true
      },
      system_meta_desc:{
        required:true
      },
      system_meta_keywords:{
        required:true
      },
      system_info_email:{
        required:true,
        email:true
      },
      system_web_master_email:{
        required:true,
        email:true
      },
      system_auto_email:{
        required:true,
        email:true
      },
      system_webmaster_ph:{
        required:true,
        digits:true
      }
    },
    messages:{
      system_meta_title:{
        required:'Please enter meta title'
      },
      system_meta_desc:{
        required:'Please enter meta description'
      },
      system_meta_keywords:{
        required:'Please enter meta keywords'
      },
      system_info_email:{
        required:'Please enter info email',
        email:'Email is not valid'
      },
      system_web_master_email:{
        required:'Please enter webmaster email',
        email:'Email is not valid'
      },
      system_auto_email:{
        required:'Please enter auto email',
        email:'Email is not valid'
      },
      system_webmaster_ph:{
        required:'Please enter Phone no.',
        digits:'Phone No. is not valid'
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
    	 // var f_data = FormDataJson.formToJson(document.getElementById("form_settings"));
      // 	var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      	$.ajax({
      		type:'POST',
      		url:base_url+'/settings/save',
      		data:new FormData($('#form_settings')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
        	beforeSend:function(){
	          $('#btn_submit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving Settings...</span>').prop('disabled',true);
	        },
	        success:function(d,status,xhr){
	        	if(d.success){

	        		$('#btn_submit').html(d.success).prop('disabled',true);

		            setTimeout(function(){               
		              $('#btn_submit').html('Save Settings').prop('disabled',false);
		              
		            },1200);
		            
		        }else{
		            Swal.fire({
		              icon: 'error',
		              title: d.error,
		              confirmButtonText:'Close',
		              confirmButtonColor:'#d33',
		              allowOutsideClick: false,
		            });
					$('#btn_submit').html('Save Settings').prop('disabled',false);
		        }
	        },
	        error: function( jqXhr ) {
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

	          	$('#btn_submit').html('Save Settings').prop('disabled',false);
	        },
	        complete:function(status,xhr){
	         // $('#btn_submit').html('Sign In');
	        }
      	});
    }
  });

  $('#form_folder_browser').validate({
    rules:{
      folder_name:{
        required:true,
        alphanumeric: true,
        minlength:3,
        maxlength:128
      }
    },
    messages:{
      folder_name:{
        required:'Enter folder name',
        alphanumeric: "Letters, numbers, and underscores only please",
        minlength: "Folder name should be at least 8 characters",
        maxlength: "Folder name should be maximum 128 characters"
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
    submitHandler:function(f){
      var f_data = FormDataJson.formToJson(document.getElementById("form_folder_browser"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      alert(ctext);
    }
  });


  $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });
  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  });
  
});