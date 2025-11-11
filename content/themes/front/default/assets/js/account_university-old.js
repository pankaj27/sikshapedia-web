jQuery(function($) {
  "use strict";

  jQuery.validator.addMethod("pwcheck", function (value, element) {
    return this.optional(element) || /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(value);
  }, "Password must contain atleast one digit , one lowercase letter , one uppercase letter and one special character(!@#$%^&)");

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
  	return arg !== value;
  }, "Value must not equal arg.");

  $('#scholarships_value').summernote();


  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 10000
  });

  $('body').on('change','#register_country',function(){
  	var country =	$('#register_country :selected').val();
  	var f_data 	= 	new Array(country);
    var ctext 	= 	CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
  	$.ajax({
  		type:'POST',
  		url:base_url+'get_states',
  		data:{ctext:ctext,csrf_test_name:csrf_hash},
  		success:function(d){
  			$('#registration_state').html(d.html);
  		}
  	});
  });

  $('body').on('change','#registration_state',function(){
  	var country =	$('#register_country :selected').val();
  	var state 	=	$('#registration_state :selected').val();
  	var f_data 	= 	new Array(country,state);
    var ctext 	= 	CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
  	$.ajax({
  		type:'POST',
  		url:base_url+'get_districts',
  		data:{ctext:ctext,csrf_test_name:csrf_hash},
  		success:function(d){
  			$('#registration_district').html(d.html);
  		}
  	});
  });


  $('body').on('change','#registration_district',function(){
  	
  });

  $('body').on('click','.info_tabs',function(){

    var info_tabs=$(this).attr('data-tabs');    
    //onLoadPages(info_tabs);    
  });

 //onLoadPages('general_settings');

  $('#form_general_settings').validate({
  	rules:{
  		user_type:{
  			valueNotEquals:''
  		},
  		register_country:{
  			valueNotEquals:''
  		},
  		registration_state:{
  			valueNotEquals:''
  		},
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
      registration_pincode:{
        required:true
      }
  	},
  	messages:{
  		user_type:{
  			valueNotEquals:'Please select your account type'
  		},
  		register_country:{
  			valueNotEquals:'Please select your country'
  		},
  		registration_state:{
  			valueNotEquals:'please select your state of province'
  		},
  		registration_name:{
  			required:'pllease enter your name or your institution name'
  		},
  		registration_email:{
  			required:'Please enter your email address',
  			email:'Email address is not valid'
  		},
  		registration_phone_no:{
  			required:'Please your phone no.'
  		},
      registration_pincode:{
        required:'Please enter pincode'
      }
  	},
  	submitHandler:function(f){

      var formData = new FormData($('#form_general_settings')[0]);
      formData.append('csrf_test_name', csrf_hash);

    	$.ajax({
        type:'POST',
        url:base_url+'updateaccount',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        beforeSend:function(){
          $('#registration_name').prop('disabled',true);
          $('#registration_email').prop('disabled',true);
          $('#registration_phone_no').prop('disabled',true);
          $('#btn_update_account').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d,status,xhr){
          if(d.success){
            Toast.fire({
  				    icon: 'success',
  				    title: d.success
  				  });
            $('#registration_name').prop('disabled',false);
        		$('#registration_email').prop('disabled',false);
        		$('#registration_phone_no').prop('disabled',false);
          	$('#btn_update_account').html('Update').prop('disabled',false);
          	//$('#form_account_type')[0].reset();           
          }else{
          	Toast.fire({
			        icon: 'error',
			        title: d.error
			      });
            $('#registration_name').prop('disabled',false);
          	$('#registration_email').prop('disabled',false);
          	$('#registration_phone_no').prop('disabled',false);
            $('#btn_update_account').html('Update').prop('disabled',false);
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
            $('#btn_update_account').html('Update').prop('disabled',false);
        },
        complete:function(status,xhr){
         // $('#btn_submit').html('Sign In');
        }
      });
  	}
  });


  $('#form_page_settings').validate({
    rules:{
      registration_title:{
        required:true,
        maxlength:100,
        minlength:20
      },
      registration_keywords:{
        required:true,
        maxlength:255,
        minlength:20
      },
      registration_short_description:{
        required:true,
        maxlength:150,
        minlength:20
      }
    },
    messages:{
      registration_title:{
        required:'Please enter title'
      },
      registration_keywords:{
        required:'Please enter keywords separated by comma'
      },
      registration_short_description:{
        required:'Please enter short description'
      }
    },
    submitHandler:function(f){
      var formData = new FormData($('#form_page_settings')[0]);
      formData.append('csrf_test_name', csrf_hash);
      //var f_data = FormDataJson.formToJson(formData);
      //var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      $.ajax({
        type:'POST',
        url:base_url+'updateaccount',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        beforeSend:function(){
          $('#registration_title').prop('disabled',true);
          $('#registration_keywords').prop('disabled',true);
          $('#registration_short_description').prop('disabled',true);
          $('#btn_update_page').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d,status,xhr){
          if(d.success){
            Toast.fire({
              icon: 'success',
              title: d.success
            });
            $('#registration_title').prop('disabled',false);
            $('#registration_keywords').prop('disabled',false);
            $('#registration_short_description').prop('disabled',false);
            $('#btn_update_page').html('Update').prop('disabled',false);
            //$('#form_account_type')[0].reset();           
          }else{
            Toast.fire({
              icon: 'error',
              title: d.error
            });
            $('#registration_title').prop('disabled',false);
            $('#registration_keywords').prop('disabled',false);
            $('#registration_short_description').prop('disabled',false);
            $('#btn_update_page').html('Update').prop('disabled',false);
          }
        },
        error: function( jqXhr ) {
          if( jqXhr.status == 400 ) {
            window.location.reload();
          }else if( jqXhr.status == 403 ) {
            window.location.reload();
          }
            $('#registration_title').prop('disabled',false);
            $('#registration_keywords').prop('disabled',false);
            $('#registration_short_description').prop('disabled',false);
            $('#btn_update_page').html('Update').prop('disabled',false);
        },
        complete:function(status,xhr){
         // $('#btn_submit').html('Sign In');
        }
      });
    }
  });

  $('#form_info_settings').validate({
    rules:{
      registration_estd_year:{
        required:true,
        minlength:4,
        maxlength:4,
        number:true
      },
      registration_type:{
        valueNotEquals:""
      }
    },
    messages:{
      registration_estd_year:{
        required:'Please enter Estd. Year',
        minlength:'Year must be 4 digits long',
        maxlength:'Year must be 4 digits long',
        number:'Only digits are allowed'
      },
      registration_type:{
        valueNotEquals:'Please select university type'
      }
    },
    submitHandler:function(f){
      var formData = new FormData($('#form_info_settings')[0]);
      formData.append('csrf_test_name', csrf_hash);

      $.ajax({
        type:'POST',
        url:base_url+'updateuniversityaccount',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        beforeSend:function(){
          $('#registration_estd_year').prop('disabled',true);
          $('#registration_type').prop('disabled',true);
          $('#btn_update_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d,status,xhr){
          if(d.success){
            Toast.fire({
              icon: 'success',
              title: d.success
            });
            $('#registration_estd_year').prop('disabled',false);
            $('#registration_type').prop('disabled',false);
            $('#btn_update_info').html('Update').prop('disabled',false);
            var table=$('#faculty_list_table').DataTable();
            table.ajax.reload( null, false );           
          }else{
            Toast.fire({
              icon: 'error',
              title: d.error
            });
            $('#registration_estd_year').prop('disabled',false);
            $('#registration_type').prop('disabled',false);
            $('#btn_update_info').html('Update').prop('disabled',false);
          }
        },
        error: function( jqXhr ) {
          if( jqXhr.status == 400 ) {
            window.location.reload();
          }else if( jqXhr.status == 403 ) {
            window.location.reload();
          }
            $('#registration_estd_year').prop('disabled',false);
            $('#registration_type').prop('disabled',false);
            $('#btn_update_info').html('Update').prop('disabled',false);
        },
        complete:function(status,xhr){
         // $('#btn_submit').html('Sign In');
        }
      });
    }
  });

  $('#form_course_settings').validate({
        rules:{
          registration_course:{
            valueNotEquals:''
          },
          registration_course_duration_years:{
            valueNotEquals:''
          },
          registration_course_duration_type:{
            valueNotEquals:''
          },
          registration_course_type:{
            valueNotEquals:''
          },
          registration_course_pass_type:{
            valueNotEquals:''
          },
          registration_course_placement_type:{
            valueNotEquals:''
          },
        },
        messages:{
          registration_course:{
            valueNotEquals:'Select course to add'
          },
          registration_course_duration_years:{
            valueNotEquals:'Select course duration'
          },
          registration_course_duration_type:{
            valueNotEquals:'Select course duration type'
          },
          registration_course_type:{
            valueNotEquals:'Select coursse type'
          },
          registration_course_pass_type:{
            valueNotEquals:'Select course pass type'
          },
          registration_course_placement_type:{
            valueNotEquals:'Select course placement type'
          },
        },
        submitHandler:function(f){
          var formData = new FormData($('#form_course_settings')[0]);
          formData.append('csrf_test_name', csrf_hash);
          formData.append('data_type', 'course_settings');
          formData.append('_course', '_course');

          $.ajax({
            type:'POST',
            url:base_url+'updateuniversityaccount',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            beforeSend:function(){
              $("#form_course_settings :input").prop("disabled", true);
              $('#btn_update_course').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            },
            success:function(d,status,xhr){
              if(d.success){
                Toast.fire({
                  icon: 'success',
                  title: d.success
                });
                $("#form_course_settings :input").prop("disabled", false);
                $("#form_course_settings")[0].reset();
                $('#btn_update_course').html('Update').prop('disabled',false);           
              }else{
                Toast.fire({
                  icon: 'error',
                  title: d.error
                });
                 $("#form_course_settings :input").prop("disabled", false);
                 $('#btn_update_course').html('Update').prop('disabled',false);
              }
            },
            error: function( jqXhr ) {
              if( jqXhr.status == 400 ) {
                window.location.reload();
              }else if( jqXhr.status == 403 ) {
                window.location.reload();
              }
              $("#form_course_settings :input").prop("disabled", false);
              $('#btn_update_course').html('Update').prop('disabled',false);
            },
            complete:function(status,xhr){
             // $('#btn_submit').html('Sign In');
            }
          });
        }
  });


  $('#form_faculty_settings').validate({
    rules:{
      registration_faculty_name:{
        required:true
      },
      registration_faculty_email:{
        email:true
      }
    },
    messages:{
      registration_faculty_name:{
        required:'Please enter name'
      },
      registration_faculty_email:{
        email:'Email id is not valid'
      }
    },
    submitHandler:function(f){
      var formData = new FormData($('#form_faculty_settings')[0]);
          formData.append('csrf_test_name', csrf_hash);
          formData.append('_faculty', _faculty);

          $.ajax({
            type:'POST',
            url:base_url+'updateuniversityaccount',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            beforeSend:function(){
              $("#form_faculty_settings :input").prop("disabled", true);
              $('#btn_update_faculty').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            },
            success:function(d,status,xhr){
              if(d.success){
                Toast.fire({
                  icon: 'success',
                  title: d.success
                });
                $("#form_faculty_settings :input").prop("disabled", false);
                if(_faculty==''){
                  $("#form_faculty_settings")[0].reset();
                  $('#btn_update_faculty').html('Add').prop('disabled',false);
                }else{
                  $('#btn_update_faculty').html('Update').prop('disabled',false);
                }
                             
              }else{
                Toast.fire({
                  icon: 'error',
                  title: d.error
                });
                $("#form_faculty_settings :input").prop("disabled", false);

                if(_faculty==''){
                  $('#btn_update_faculty').html('Add').prop('disabled',false);
                }else{
                  $('#btn_update_faculty').html('Update').prop('disabled',false);
                }
              }
            },
            error: function( jqXhr ) {
              if( jqXhr.status == 400 ) {
                window.location.reload();
              }else if( jqXhr.status == 403 ) {
                window.location.reload();
              }
              $("#form_faculty_settings :input").prop("disabled", false);
              if(_faculty==''){
                $('#btn_update_faculty').html('Add').prop('disabled',false);
              }else{
                $('#btn_update_faculty').html('Update').prop('disabled',false);
              }
            },
            complete:function(status,xhr){
             // $('#btn_submit').html('Sign In');
            }
          });
    }
  });

  $('body').on('click','.btn_del_faculty',function(){
    var _faculty=$(this).attr('data-aid');

    $.ajax({
      type:'POST',
      url:base_url+'account/faculties/delete',
      data:{csrf_test_name:csrf_hash,_faculty:_faculty},
      success:function(d){
        if(d.success){
          Toast.fire({
            icon: 'success',
            title: d.success
          });
          var table=$('#faculty_list_table').DataTable();
          table.ajax.reload( null, false ); 
        }else{
          Toast.fire({
            icon: 'error',
            title: d.success
          });
        }
      }
    });
  });

  $('body').on('change','#registration_course_duration_years',function(){

    var dy=$('#registration_course_duration_years :selected').val();
    var html=''; 

    if(dy!=''){
      for (var i = 1; i <= dy; i++) {

        html+='<tr>';
          html+='<td>'+ordinal_suffix_of(i)+' Year <input type="hidden" name="registration_course_fees['+i+'][course_year]" value="'+i+'"></td>';
          html+='<td>';
            html+='<table class="table">';
              html+='<tr><td><label>Semester 1</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_tution_fee_sem_1]"></td></tr>';
              html+='<tr><td><label>Semester 2</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_tution_fee_sem_2]"></td></tr>';
            html+='</table>';
          html+='</td>';
          html+='<td>';
            html+='<table>';
              html+='<tr><td><label>Semester 1</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_admisssion_fee_sem_1]"></td></tr>';
              html+='<tr><td><label>Semester 2</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_admisssion_fee_sem_2]"></td></tr>';
            html+='</table>';
          html+='</td>';
          html+='<td>';
            html+='<table>';
              html+='<tr><td><label>Semester 1</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_reg_fee_sem_1]"></td></tr>';
              html+='<tr><td><label>Semester 2</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_reg_fee_sem_2]"></td></tr>';
            html+='</table>';
          html+='</td>';
          html+='<td>';
            html+='<table>';
              html+='<tr><td><label>Semester 1</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_exam_fee_sem_1]"></td></tr>';
              html+='<tr><td><label>Semester 2</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_exam_fee_sem_2]"></td></tr>';
            html+='</table>';
          html+='</td>';
          html+='<td>';
            html+='<table>';
              html+='<tr><td><label>Semester 1</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_other_fee_sem_1]"></td></tr>';
              html+='<tr><td><label>Semester 2</label>';
              html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_other_fee_sem_2]"></td></tr>';
            html+='</table>';
          html+='</td>';
        html+='</tr>';



        // html+='<tr>';
        // html+='<td><strong>'+ordinal_suffix_of(i)+' year</strong></td>';
        // if(user_currency_symbol_side=='1'){
        //   html+='<td><div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1"><strong>Semester 1('+currency+')</strong></span></div><input type="number" min="0" class="form-control" value="0"></div><div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1"><strong>Semester 1('+currency+')</strong></span></div><input type="number" min="0" class="form-control" value="0"></div></td>';
        // }else{
        //   html+='<td><div class="input-group mb-3"><input type="number" min="0" class="form-control" value="0"><div class="input-group-append"><span class="input-group-text" id="basic-addon1"><strong>'+currency+'</strong></span></div></div></td>';
        // }
        
        // html+='</tr>';          
      }

      // html+='<tr class="table-striped">';
      // html+='<td><strong>Total</strong></td>';
      // if(user_currency_symbol_side=='1'){
      //   html+='<td><div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1"><strong>'+currency+'</strong></span></div><input type="text" class="form-control" value="0" readonly></div></td>';
      // }else{
      //   html+='<td><div class="input-group mb-3"><input type="text" class="form-control" value="0" readonly><div class="input-group-append"><span class="input-group-text" id="basic-addon1"><strong>'+currency+'</strong></span></div></div></td>';
      // }
        
      // html+='</tr>';
    }

    $('#course_price_list_table tbody').html(html);
  });


  

  //if(page=='course_edit'){
    $('#course_list_table').DataTable({ 
          'bJQueryUI': false,
          'stateSave': true,
          'iDisplayLength':50,
          'responsive': true,
          "pagingType": "full_numbers",
          'language': {
            'paginate': {
              'first': "<<", // This is the link to the first page
              'previous': "<", // This is the link to the previous page
              'next': ">", // This is the link to the next page
              'last': ">>" // This is the link to the last page
            }
          },
          "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
          "processing": true, //Feature control the processing indicator.
          "serverSide": true, //Feature control DataTables' server-side processing mode.
          "order": [], //Initial no order.
          // Load data for the table's content from an Ajax source
          "ajax": {
              "url": base_url+'get_user_courses',
              "type": "POST",
              "data":{csrf_test_name:csrf_hash}
          },
          //Set column definition initialisation properties.
          "columnDefs": [
          { 
              "targets": [ 0 ], //first column / numbering column
              "orderable": false, //set not orderable
          },
          ],
    });
  //}

  $('#faculty_list_table').DataTable({ 
    'bJQueryUI': false,
    'stateSave': true,
    'iDisplayLength':50,
    'responsive': true,
    "pagingType": "full_numbers",
    'language': {
      'paginate': {
        'first': "<<", // This is the link to the first page
        'previous': "<", // This is the link to the previous page
        'next': ">", // This is the link to the next page
        'last': ">>" // This is the link to the last page
      }
    },
    "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
    "processing": true, //Feature control the processing indicator.
    "serverSide": true, //Feature control DataTables' server-side processing mode.
    "order": [], //Initial no order.
    // Load data for the table's content from an Ajax source
    "ajax": {
        "url": base_url+'account/faculties/search',
        "type": "POST",
        "data":{csrf_test_name:csrf_hash}
    },
    //Set column definition initialisation properties.
    "columnDefs": [
    { 
        "targets": [ 0 ], //first column / numbering column
        "orderable": false, //set not orderable
    },
    ],
  });


  $('#form_hostel_settings_men').validate({
    submitHandler:function(){
      var formData = new FormData($('#form_hostel_settings_men')[0]);
      formData.append('csrf_test_name', csrf_hash);

      $.ajax({
        type:'POST',
        url:base_url+'updateuniversityaccount',
        data:formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        beforeSend:function(){
          $('#btn_update_hostel_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d){
          if(d.success){
            Toast.fire({
              icon: 'success',
              title: d.success
            });
            $('#btn_update_hostel_info').html('Update').prop('disabled',false); 
          }else if(d.error){
            Toast.fire({
              icon: 'error',
              title: d.error
            });
            $('#btn_update_hostel_info').html('Update').prop('disabled',false);
          }
        }
      });
    }
  });

  $('#form_hostel_settings_women').validate({
    submitHandler:function(){
      var formData = new FormData($('#form_hostel_settings_women')[0]);
      formData.append('csrf_test_name', csrf_hash);

      $.ajax({
        type:'POST',
        url:base_url+'updateuniversityaccount',
        data:formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        beforeSend:function(){
          $('#btn_update_hostel_women_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d){
          if(d.success){
            Toast.fire({
              icon: 'success',
              title: d.success
            });
            $('#btn_update_hostel_women_info').html('Update').prop('disabled',false);
          }else if(d.error){
            Toast.fire({
              icon: 'error',
              title: d.error
            });
            $('#btn_update_hostel_women_info').html('Update').prop('disabled',false);
          }
        }
      });
    }
  });


  var row=parseInt(m_row)+1;

  $('body').on('click','#btn_add_hostel_row',function(){
    var html='';

    html+='<tr id="tr' + row + '">';
    html+='<td>';
    html+='<input type="number" min="0" class="form-control" name="hostel['+row+'][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="">';
    html+='</td>';
    html+='<td>';
    html+='<input type="number" min="0" class="form-control" name="hostel['+row+'][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="0" value="">';
    html+='</td>';
    html+='<td>';
    html+='<input type="number" min="0" class="form-control" name="hostel['+row+'][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="0" value="">';
    html+='</td>';
    html+='</td>';
    html+='<td>';
    html+='<button type="button" class="btn btn-sm btn-danger" onclick="$(\'#tr' + row + '\').remove()"><i class="fa fa-minus"></i></button>';
    html+='</td>';
    html+='</tr>';

    $('#form_hostel_settings_men tbody').append(html);

    row++;

  });

  var row2=parseInt(wm_row)+1;

  $('body').on('click','#btn_add_hostel_row_women',function(){
    var html='';

    html+='<tr id="trw' + row2 + '">';
    html+='<td>';
    html+='<input type="number" min="0" class="form-control" name="hostel['+row2+'][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="">';
    html+='</td>';
    html+='<td>';
    html+='<input type="number" min="0" class="form-control" name="hostel['+row2+'][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="0" value="">';
    html+='</td>';
    html+='<td>';
    html+='<input type="number" min="0" class="form-control" name="hostel['+row2+'][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="0" value="">';
    html+='</td>';
    html+='</td>';
    html+='<td>';
    html+='<button type="button" class="btn btn-sm btn-danger" onclick="$(\'#trw' + row2 + '\').remove()"><i class="fa fa-minus"></i></button>';
    html+='</td>';
    html+='</tr>';

    $('#form_hostel_settings_women tbody').append(html);

    row2++;

  });




  function onLoadFacultyList(){
    $('#faculty_list_table').DataTable({ 
          'bJQueryUI': false,
          'stateSave': true,
          'iDisplayLength':50,
          'responsive': true,
          "pagingType": "full_numbers",
          'language': {
            'paginate': {
              'first': "<<", // This is the link to the first page
              'previous': "<", // This is the link to the previous page
              'next': ">", // This is the link to the next page
              'last': ">>" // This is the link to the last page
            }
          },
          "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
          "processing": true, //Feature control the processing indicator.
          "serverSide": true, //Feature control DataTables' server-side processing mode.
          "order": [], //Initial no order.
          // Load data for the table's content from an Ajax source
          "ajax": {
              "url": base_url+'get_faculties',
              "type": "POST",
              "data":{csrf_test_name:csrf_hash}
          },
          //Set column definition initialisation properties.
          "columnDefs": [
          { 
              "targets": [ 0 ], //first column / numbering column
              "orderable": false, //set not orderable
          },
          ],
    });

    $('.js-example-basic-multiple').select2();
  }

  function onLoadPages(page_type){
      var f_data  =   new Array(page_type);
      var ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
      $.ajax({
        type:'POST',
        url:base_url+'get_account_pages',
        data:{ctext:ctext,csrf_test_name:csrf_hash},
        success:function(d){
          if(page_type=='faculty_settings'){
            $('#info_tabs div#div_'+page_type).html(d.html);
            $("form:not(#form_"+page_type+")").html('');
           // onLoadFacultyList();
          }else{
            $('#info_tabs form#form_'+page_type).html(d.html);
            $("form:not(#form_"+page_type+")").html('');
            $("#info_tabs div#div_faculty_settings").html('');
          }
          
          
        }
      });
  }



  

  function ordinal_suffix_of(i) {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
          return i + "st";
      }
      if (j == 2 && k != 12) {
          return i + "nd";
      }
      if (j == 3 && k != 13) {
          return i + "rd";
      }
      return i + "th";
  }


 

});