// Override console.error to also log to localStorage
(function() {
  var originalConsoleError = console.error;
  console.error = function() {
    // Call the original console.error with all arguments
    originalConsoleError.apply(console, arguments);

    // Convert arguments to a string and save to localStorage
    var errorMessage = Array.prototype.join.call(arguments, ' ');
    var errors = JSON.parse(localStorage.getItem('errors')) || [];
    errors.push(errorMessage);
    localStorage.setItem('errors', JSON.stringify(errors));
  };
})();


jQuery(function($) {
  'use strict';


  $.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg != value;
  }, "Value must not equal arg.");


  //Exams

    $('#exam_list_table').DataTable({ 
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
          "url": base_url+'/streams/exams/search',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,degree:degree}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
    });

    $('body').on('click','.btn_update_slug_url',function(){
      var exam_id=$(this).attr('data-exam_id');

      $.ajax({
        type:'POST',
        url:base_url+'/streams/exams/update_slugs',
        data:{csrf_test_name:csrf_hash,_exam_id:exam_id},
        success:function(d){
          var table=$('#exam_list_table').DataTable();
                table.ajax.reload( null, false );
        }
      });
    });

    // $('#_form_exam').validate({
    //     rules:{
    //       exam_name:{
    //         required:true,
    //       },
    //       _degree:{
    //         valueNotEquals:''
    //       }
    //     },
    //     messages:{
    //        exam_name:{
    //         required:'Please enter exam name',
    //       },
    //       _degree:{
    //         valueNotEquals:'Please select degree'
    //       }
    //     },
    //     errorPlacement: function(label, element) {
    //       label.addClass('mt-2 text-danger');
    //       label.insertAfter(element);
    //     },
    //     highlight: function(element, errorClass) {
    //       $(element).parent().addClass('has-danger')
    //       $(element).addClass('form-control-danger')
    //     },
    //     submitHandler:function(f){
          
    //       var f_data = FormDataJson.formToJson(document.getElementById("form_exam"));
    //       var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

    //       $.ajax({
    //         type:'POST',
    //         url:base_url+'/streams/degrees/exams/add',
    //         data: {ctext:ctext,csrf_test_name:csrf_hash},
    //         cache:true,
    //         beforeSend:function(){
    //           $('#exam_name').prop('disabled',true);
    //           $('#btn_save_exam').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
    //         },
    //         success:function(d,status,xhr){

    //           if(d.success){

    //             var table=$('#exam_list_table').DataTable();
    //             table.ajax.reload( null, false );

    //             $('#exam_name').prop('disabled',false);
    //             $('#btn_save_exam').html(d.success).prop('disabled',false);

    //             setTimeout(function(){               
    //               $('#btn_save_exam').html('Save').prop('disabled',false);
    //             },1200);
                
                
    //           }else{
    //             Swal.fire({
    //               icon: 'error',
    //               title: d.error,
    //               confirmButtonText:'Close',
    //               confirmButtonColor:'#d33',
    //               allowOutsideClick: false,
    //             });

    //             $('#exam_name').prop('disabled',false);
    //             $('#btn_save_exam').html('Save').prop('disabled',false);
    //           }
    //         },
    //         error: function( jqXhr ) {
    //           //alert(jqXhr)
    //           if( jqXhr.status == 400 ) {
    //               Swal.fire({
    //                 icon: 'error',
    //                 title: 'Request url not found',
    //                 confirmButtonText:'Close',
    //                 confirmButtonColor:'#d33',
    //                 allowOutsideClick: false,
    //               });
    //               window.location.reload();
    //           }else if( jqXhr.status == 403 ) {
    //               Swal.fire({
    //                 icon: 'error',
    //                 title: 'Request is forbidden',
    //                 confirmButtonText:'Close',
    //                 confirmButtonColor:'#d33',
    //                 allowOutsideClick: false,
    //               });
    //               window.location.reload();
    //           }

    //           $('#exam_name').prop('disabled',false);
    //           $('#btn_save_exam').html('Save').prop('disabled',false);
    //         },
    //         complete:function(status,xhr){
    //          $('#form_exam')[0].reset();
    //         }
    //       });
    //     }
    // });

    $('body').on('click','.btn_del_exam',function(){
        var _exam=$(this).attr('data-exam');

        Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'mr-2',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          $.ajax({
            type:'POST',
            url:base_url+'/streams/exams/delete',
            data:{csrf_test_name:csrf_hash,_exam:_exam},
            success:function(d){
              if(d.success){
                Swal.fire('Deleted!',d.success,'success');
                var table=$('#exam_list_table').DataTable();
                        table.ajax.reload( null, false );
              }else if(d.error){
                Swal.fire('Not Deleted!',d.error,'error');
              }
            }
          });     
        }
      })
    });


    $('#form_exam_excel').validate({
      rules:{
        exam_stream:{
          valueNotEquals:'0'
        },
        exam_excel:{
          required: true,
          extension: "xls|xlsx"
        }
      },
      messages:{
        exam_stream:{
          valueNotEquals:'Select stream'
        },
        exam_excel:{
          required: 'Select excel file',
          extension:"Select valied input file format"
        }
      },
      submitHandler:function(){
          $.ajax({
            type:'POST',
            url:base_url+'/streams/exams/import',
            data:new FormData($('#form_exam_excel')[0]),
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            target: '.preview',
            beforeSend:function(){
                $('#btn_import_exam').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            },
            success:function(f){
                if(f.success){
                 $('#btn_import_exam').prop('disabled',true);
                 Swal.fire({
                    icon: 'success',
                    title: f.success,
                    confirmButtonText:'Close',
                    confirmButtonColor:'#69da68',
                    allowOutsideClick: false,
                  });
                  var table=$('#exam_list_table').DataTable();
                  table.ajax.reload( null, false );
                  $('#form_exam_excel').trigger("reset");
                  $('#examImportModal').modal('hide');         
                }else if(f.error){
                  $('#btn_import_exam').prop('disabled',true);
                  Swal.fire({
                    icon: 'error',
                    title: f.error,
                    confirmButtonText:'Close',
                    confirmButtonColor:'#69da68',
                    allowOutsideClick: false,
                  });
                }else if(f.redirect){
                  $('#btn_import_exam').prop('disabled',true);
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
                $('#btn_import_exam').html('Save').attr('disabled',false);
            },
            resetForm: true 
          });
        }
    });


    $('body').on('click','#btn_add_exam_modal',function(){
      $('#form_exam')[0].reset();
    });


    $('#form_exam').validate({
        rules:{
          exam_name:{
            required:true,
          },
          "exam_stream[]":{
            required:false,
          },
          exam_logo:{
            required:false,
            extension: "jpeg|jpg,png"
          }
        },
        messages:{
           exam_name:{
            required:'Please enter exam name',
          },
          "exam_stream[]":{
            required:"Select stream",
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
          
          $.ajax({
            type:'POST',
            url:base_url+'/streams/exams/add',
            data:new FormData($('#form_exam')[0]),
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            target: '.preview',
            cache:true,
            beforeSend:function(){
              $('#exam_name').prop('disabled',true);
               $('#exam_short_name').prop('disabled',true);
              $('#btn_add_exam').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            },
            success:function(d,status,xhr){

              if(d.success){

                Swal.fire({
                  icon: 'success',
                  title: d.success,
                  confirmButtonText:'Close',
                  allowOutsideClick: false,
                });

                var table=$('#exam_list_table').DataTable();
                table.ajax.reload( null, false );

                $('#exam_name').prop('disabled',false);
                $('#exam_short_name').prop('disabled',false);
                $('#btn_add_exam').html(d.success).prop('disabled',false);

                setTimeout(function(){               
                  $('#btn_add_exam').html('Save').prop('disabled',false);
                },1200);
                
                
              }else{
                Swal.fire({
                  icon: 'error',
                  title: d.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#d33',
                  allowOutsideClick: false,
                });

                $('#exam_name').prop('disabled',false);
                $('#exam_short_name').prop('disabled',false);
                $('#btn_add_exam').html('Save').prop('disabled',false);
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

              $('#exam_name').prop('disabled',false);
              $('#exam_short_name').prop('disabled',false);
              $('#btn_add_exam').html('Save').prop('disabled',false);
            },
            complete:function(status,xhr){
              if($('#_exam').val()==''){
            $('#form_exam')[0].reset();
              }
            }
          });
        }
    });


    $('#examsModal').on('show.bs.modal', function() {
      var _exam=$('#examsModal').find('#_exam').val();
        $.ajax({
          type:'POST',
          url:base_url+'/streams/get_streams',
          data:{csrf_test_name:csrf_hash,_exam:_exam},
          success:function(d){
            if(d.html){
              $('#examsModal').find('div#streams_div').html(d.html);
            }
          }
        });
    });

    $('body').on('change','#exam_type',function(){
      var s=$('#exam_type :selected').val();

      if(s=='2'){
        let country=$('#exam_country :selected').val();

          let f_data  =   new Array(country);
          let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
          $.ajax({
            type:'POST',
            url:base_url+'/country/get_states',
            data:{ctext:ctext,listing_type:'1',csrf_test_name:csrf_hash},
            success:function(d){
              $('#exam_state').html(d.html);
            }
          });
        $('#exam_state_div').css('display','block');
      }else{
        $('#exam_state').html('');
        $('#exam_state_div').css('display','none');
      }
    });


    $('body').on('click','.btn_exam',function(){
      $('#examsModal').find('#_exam').val($(this).attr('data-exam'));
      $('#examsModal').find('#exam_name').val($(this).attr('data-exam_name'));
      $('#examsModal').find('#exam_short_name').val($(this).attr('data-exam_short_name'));
      $('#examsModal').find('#exam_description').html($(this).attr('data-exam_short_desc'));
      $('#examsModal').modal('show');
    });

    $('body').on('click','.btn_update_exam_dates',function(){
      $('#examsdatesModal').find('#_exam').val($(this).attr('data-exam'));
      $('#examsdatesModal').find('.modal-title').html('Add/Edit '+$(this).attr('data-exam_name')+' Dates');
      $('#examsdatesModal').find('#exam_short_desc').val($(this).attr('data-exam_short_desc'));
      $('#examsdatesModal').modal('show');
    });

    if($('#exam_application_start_date').length>0){
       $('#exam_application_start_date').datepicker({ format: "dd-mm-yyyy"});
    }

    if($('#exam_application_end_date').length>0){
       $('#exam_application_end_date').datepicker({ format: "dd-mm-yyyy"});
    }

    if($('#exam_start_date').length>0){
       $('#exam_start_date').datepicker({ format: "dd-mm-yyyy"});
    }

    if($('#exam_result_start_date').length>0){
       $('#exam_result_start_date').datepicker({ format: "dd-mm-yyyy"});
    }

    if($('#exam_result_end_date').length>0){
       $('#exam_result_end_date').datepicker({ format: "dd-mm-yyyy"});
    }

    if($('#exam_end_date').length>0){
       $('#exam_end_date').datepicker({ format: "dd-mm-yyyy"});
    }

    $('#examsdatesModal').on('shown.bs.modal', function (e){
      var _exam_id=$('#examsdatesModal').find('#_exam').val();

      load_exam_dates_table(_exam_id);
    })

    $('#form_exam_dates').validate({
      rules:{
        exam_short_desc:{
          required:true
        }
      },
      messages:{
        exam_short_desc:{
          required:'Short description is required'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/streams/exams/dateadd',
          data:$('#form_exam_dates').serialize(),
          beforeSend:function(){
                  $('#btn_add_exam_dates').html('<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Uploading...</span></div>').attr('disabled',true);
                },
          success:function(d){
            if(d.success){
              Swal.fire({
                      icon: 'success',
                      title: d.success,
                      confirmButtonText:'Close',
                      allowOutsideClick: false,
                    });
                    var table=$('#exams_dates_table').DataTable();
                      table.ajax.reload( null, false );
            }else{
              Swal.fire({
                      icon: 'error',
                      title: d.error,
                      confirmButtonText:'Close',
                      allowOutsideClick: false,
                    });
            }
          },
          complete:function(xhr,status){
            $('#btn_add_exam_dates').html('Save');
            $('#form_exam_dates')[0].reset();
            setTimeout(function(){
              $('#examsdatesModal').modal('hide');
            },3000);
          }
        });
      }
    });

    $('body').on('click','.btn_del_exam_dates',function(){
      var exam_id=$(this).attr('data-exam_id');
      var dates_data_id=$(this).attr('data-dates_data_id');
      Swal.fire({
          title: "Do you want to delete the Banner?",
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
          url:base_url+'/streams/exams/datedelete',
          data:{[csrf_name]:csrf_hash,exam_id:exam_id,date_data_id:dates_data_id},
          success:function(d){
            if(d.success){
              Swal.fire({
                      icon: 'success',
                      title: d.success,
                      confirmButtonText:'Close',
                      allowOutsideClick: false,
                    });
                    var table=$('#exams_dates_table').DataTable();
                      table.ajax.reload( null, false );
            }else{
              Swal.fire({
                      icon: 'error',
                      title: d.error,
                      confirmButtonText:'Close',
                      allowOutsideClick: false,
                    });
            }
          }
        });

          }
        });
      


      
    });

    function load_exam_dates_table(exam_id){
      $('#exams_dates_table').DataTable().destroy();
      $('#exams_dates_table').DataTable({ 
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
              "url": base_url+'/streams/exams/datesearch',
              "type": "POST",
              "data":{csrf_test_name:csrf_hash,exam_id:exam_id}
          },
          //Set column definition initialisation properties.
          "columnDefs": [
          { 
              "targets": [ 0 ], //first column / numbering column
              "orderable": false, //set not orderable
          },
          ],
      });
    }

    $('body').on('click','.btn_change_single_data',function(){
      var _exam=$(this).attr('data-exam');
      var _field=$(this).attr('data-field');
      var _field_data=$(this).attr('data-field_value');

      $.ajax({
        type:'POST',
        url:base_url+'/streams/exams/update_single',
        data:{csrf_test_name:csrf_hash,_exam:_exam,_field:_field,_field_data:_field_data},
        success:function(d){
          if(d.success){
            Swal.fire({
                    icon: 'success',
                    title: d.success,
                    confirmButtonText:'Close',
                    allowOutsideClick: false,
                  });
                  var table=$('#exam_list_table').DataTable();
                    table.ajax.reload( null, false );
          }else if(d.error){
            Swal.fire({
                    icon: 'error',
                    title: d.error,
                    confirmButtonText:'Close',
                    allowOutsideClick: false,
                  });
          }
        }
      });
    });


    $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
    });
    $('.file-upload-default').on('change', function() {
      $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    });

});