var p_row='';


  // Add the following into your HEAD section
	var timer = 0;
	function set_interval() {
	  // the interval 'timer' is set as soon as the page loads
	  timer = setInterval("auto_logout()", 3000000);

	  $('#log').html(timer);
	  // the figure '10000' above indicates how many milliseconds the timer be set to.
	  // Eg: to set it to 5 mins, calculate 5min = 5x60 = 300 sec = 300,000 millisec.
	  // So set it to 300000
	}

	function reset_interval() {
	  //resets the timer. The timer is reset on each of the below events:
	  // 1. mousemove   2. mouseclick   3. key press 4. scroliing
	  //first step: clear the existing timer

	  if (timer != 0) {
	    clearInterval(timer);
	    timer = 0;
	    // second step: implement the timer again
	    timer = setInterval("auto_logout()", 3000000);
	    // completed the reset of the timer

	    $('#log').html(timer);
	  }
	}

	function auto_logout() {
	  if(typeof(Storage) !== "undefined"){
	  	sessionStorage.clear();
	  }
	  
	  window.location = base_url+"/logout";
	}


	window.onload=set_interval;
	window.onmousemove=reset_interval;
	window.onmouseover =reset_interval;
	window.onmouseup =reset_interval;
	window.onmouseout =reset_interval;
	window.onclick=reset_interval;
	window.onkeypress=reset_interval;
	window.onscroll=reset_interval;




jQuery(function($) {
 'use strict';

  jQuery.validator.addMethod("pwcheck", function (value, element) {
    return this.optional(element) || /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
  }, "Password must contain atleast one digit , one lowercase letter , one uppercase letter and one special character(!@#$%^&)");

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");
  
	$('#form_update_data').validate({
	    rules:{
	      user_old_password:{
	        required:true,
	        minlength:8,
	        maxlength:16,
	        pwcheck:true
	      },
	      user_new_password:{
	        required:true,
	        minlength:8,
	        maxlength:16,
	        pwcheck:true
	      },
	      user_confirm_password:{
	      	minlength:8,
	        maxlength:16,
	        equalTo : "#user_new_password"
	      }
	    },
	    messages:{
	      user_old_password:{
	        required:'Please enter your password',
        	minlength:'Minimum 8 characters required',
        	maxlength:'Maximum 16 characters allowed'
	      },
	      user_new_password:{
	        required:'Please enter your password',
        	minlength:'Minimum 8 characters required',
        	maxlength:'Maximum 16 characters allowed'
	      },
	    },
	    submitHandler:function(){
	    	var f_data = FormDataJson.formToJson(document.getElementById("form_update_data"));
      		var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
	      $.ajax({
	          type:'POST',
	          url:base_url+'/profile_update',
	          data:{ctext:ctext,csrf_test_name:csrf_hash,update_type:'profile_user_data'},
	          cache: false,
	          beforeSend:function(){
	            $('#btn_update_password').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	          },
	          success:function(f){
	            if(f.success){
	             $('#btn_update_password').prop('disabled',true);
	             Swal.fire({
	                icon: 'success',
	                title: f.success,
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
	              });
	                        
	            }else if(f.error){
	              $('#btn_update_password').prop('disabled',true);
	              Swal.fire({
	                icon: 'error',
	                title: f.error,
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
	              });
	            }else if(f.redirect){
	              $('#btn_update_password').prop('disabled',true);
	              Swal.fire({
	                icon: 'info',
	                title: 'Your session expired',
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
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
	            $('#form_update_data').find('#user_old_password').val('');
	            $('#form_update_data').find('#user_new_password').val('');
	            $('#form_update_data').find('#user_confirm_password').val('');
	            $('#btn_update_password').html('Save').attr('disabled',false);
	            $('#changePassModal').modal('hide');
	          },
	          resetForm: true 
	      });
	    }
	});

	//$(".select_placement").chosen({no_results_text: "Select Comapny"});

	 var placement_row=p_row;
    
    $('body').on('click','#btn_placement_data',function(){
    
      var phtml='';

      var companies='<option value="0">Select Company</option>';

      $.ajax({
      	type:'POST',
      	url:base_url+'/get_placement_companies',
      	data:{college_id:0,csrf_test_name:csrf_hash},
      	success:function(d){
      		if(d.placement_companies!=''){
      			$.each(d.placement_companies,function(i,v){
      				companies+='<option value="'+v['placement_company_id']+'">'+v['placement_company_name']+'</option>';
      			});
      		}

      		phtml+='<tr id="tr_pl' + placement_row + '">';
		      phtml+='<td>';
		      phtml+='<input type="number" class="form-control" min="2010" name="college_placement_data['+placement_row+'][year]" value="2010">';
		      phtml+='</td>';
		      phtml+='<td>';
		      phtml+='<select class="form-control select_placement" name="college_placement_data['+placement_row+'][company]">'+companies+'</select>';
		      phtml+='</td>';
		      phtml+='<td>';
		      phtml+='<input type="text" class="form-control" min="2010" name="college_placement_data['+placement_row+'][package]" value="">';
		      phtml+='</td>';
		      phtml+='<td>';
		      phtml+='<button type="button" class="btn btn-sm btn-danger" onclick="$(\'#tr_pl' + placement_row + '\').remove()"><i class="fa fa-minus"></i></button>';
		      phtml+='</td>';
		      phtml+='</tr>';

		      //$('.select_placement').trigger("chosen:updated");

		      $('#form_college_placement_data table tbody').append(phtml);

      		placement_row++;
      	}
      });


      

      
    });


    $('#form_college_placement_data').validate({
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/placement_add',
          data:$('#form_college_placement_data').serialize(),
          beforeSend:function(){
            $('#btn_save_placement_data').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(d){
            if(d.success){
              Swal.fire({
                icon: 'success',
                title: d.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: d.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }
          },
          complete:function(){
            $('#btn_save_placement_data').html('Update').prop('disabled',false);
          }
        });
      }
    });

});


