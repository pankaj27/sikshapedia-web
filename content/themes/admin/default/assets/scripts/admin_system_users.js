jQuery(function($) {
  'use strict';

  $.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");

      $('#user_list_table').DataTable({ 
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
            "url": base_url+'/users/search_internal',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,user_type:_user_type}
        },
        //Set column definition initialisation properties.
        "columnDefs": [
        { 
            "targets": [ 0 ], //first column / numbering column
            "orderable": false, //set not orderable
        },
        ],
      });


  $('#college_user_list_table').DataTable({ 
        'bJQueryUI': false,
        'stateSave': true,
        'iDisplayLength':10,
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
            "url": base_url+'/users/search_external',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,user_type:_user_type}
        },
        //Set column definition initialisation properties.
        "columnDefs": [
        { 
            "targets": [ 0 ], //first column / numbering column
            "orderable": false, //set not orderable
        },
        ],
  });


  $('#college_user_student_list_table').DataTable({ 
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
            "url": base_url+'/users/students/search',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,user_type:_user_type}
        },
        //Set column definition initialisation properties.
        "columnDefs": [
        { 
            "targets": [ 0 ], //first column / numbering column
            "orderable": false, //set not orderable
        },
        ],
      });


  $('body').on(' click','.btn_user_update',function(){
    $('#userRegModal').find('#input_user').val($(this).attr('data-id'));
     $('#userRegModal').find('#input_user_name').val($(this).attr('data-user_name'));
  });


  $('body').on('change','#input_user_state',function(){
    let country = $('#input_user_country :selected').val();
    let state   = $('#input_user_state :selected').val();
    let f_data  =   new Array(country,state);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_cities',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#input_user_city').html(d.html);
      }
    });
  });



  $('#form_system_users').validate({
    rules:{
      input_full_name:{
        required:true
      },
      input_user_email:{
        required:true,
        email:true
      },
      input_user_phone:{
        required:false
      },
      input_user_name:{
        required:true
      },
      input_user_password:{
        required:true
      },
      input_user_pincode:{
        required: false
      }
    },
    messages:{
      input_full_name:{
        required:"Please enter user full name"
      },
      input_user_email:{
        required:"Enter email address",
        email:"Email address is not valid"
      },
      input_user_phone:{
        required:"Please enter user Phone No."
      },
      input_user_name:{
        required:"Please enter user name",
      },
      input_user_password:{
        required:"Please enter password"
      }
    },
    submitHandler:function(){
      $.ajax({
          type:'POST',
          url:base_url+'/users/add_internal_users',
          data:new FormData($('#form_system_users')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_save_system_user').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_save_system_user').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              var table=$('#user_list_table').DataTable();
              table.ajax.reload( null, false );
              $('#form_system_users').trigger("reset");      
            }else if(f.error){
              $('#btn_save_system_user').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_system_user').prop('disabled',true);
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
            $('.progress-bar').css('width', '0%').text('0%');
            $('#btn_save_system_user').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('body').on('click','.btn_del_internal_user',function(){

    var did=$(this).attr('data-id');
    Swal.fire({
        title: "Do you want to delete the user?",
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69da68',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value){
          $.ajax({
            type:'POST',
            url:base_url+'/users/delete_internal_users',
            data:{_user:did,csrf_test_name:csrf_hash},
            beforeSend:function(){

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
                var table=$('#user_list_table').DataTable();
                table.ajax.reload( null, false );
              }else{
                Swal.fire({
                  icon: 'error',
                  title: d.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });
              }
            }
          });
        }
      });
  });


  $('body').on('click','.btn_single_data_update',function(){

    var data_id=$(this).attr('data-aid');
    var data_field=$(this).attr('data-field');
    var data_value=$(this).attr('data-val');


    $.ajax({
        type:'POST',
        url:base_url+'/users/change_single_data',
        data:{csrf_test_name:csrf_hash,data_id:data_id,data_field:data_field,data_value:data_value},
        success:function(d){
          var table=$('#user_list_table').DataTable();
          table.ajax.reload( null, false );
        }
    });


  });

  if($('.dashboard-date').length) {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('.dashboard-date').datepicker({
      format: "dd-MM-yyyy",
      todayHighlight: true,
      autoclose: true
    });
    $('.dashboard-date').datepicker('setDate', today);
  }


  $('body').on('click','#view_stat',function(){
    var start_date=$('#start_date').val();
    var end_date=$('#end_date').val();
    var state_id=$('#stat_state').val();

    $.ajax({
        type:'POST',
        url:base_url+'/users/search_internal_users_stat',
        data:{csrf_test_name:csrf_hash,user_id:user_id,start_date:start_date,end_date:end_date,state_id:state_id},
        beforeSend:function(){
            $('#view_stat').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
        },
        success:function(d){
          $('#user_stat_list_table tbody').html(d.html);

          if(d.file_link){
            $('#file_to_download').attr('href',d.file_link);
            $('#file_to_download')[0].click();

          }
        },
        complete:function(xhr,status){
          $('#view_stat').html('View').prop('disabled',false);
        }
    });
  });


});