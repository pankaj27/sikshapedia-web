jQuery(function($) {
  'use strict'; 


  $('#reviewed_colleges_list_table').DataTable({ 
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
        "url": base_url+'/reviews/colleges/search',
        "type": "POST",
        "data":{csrf_test_name:csrf_hash,_college:_college}
    },
    //Set column definition initialisation properties.
    "columnDefs": [
    { 
        "targets": [ 0 ], //first column / numbering column
        "orderable": false, //set not orderable
    },
    ],
  });

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");


  $('#form_mark_review').validate({
      rules:{
        review_status:{
          valueNotEquals:'0'
        }
      },
      messages:{
        review_status:{
          valueNotEquals:'Select status'
        }
      },
      submitHandler:function(){
        Swal.fire({   
              title: "Are you sure?",   
              text: "You will be able to edit this data later",   
              icon: 'warning',  
              showCancelButton: true,   
              confirmButtonColor: '#002970', 
              cancelButtonColor: '#f11026', 
              confirmButtonText: "Yes, create",   
              cancelButtonText: "No, cancel",
              allowOutsideClick: false
            }).then((isConfirm)=>{

              if (isConfirm) {

                var formData=new FormData($('#form_mark_review')[0]);

                $.ajax({
                  type:'POST',
                  url:base_url+'/reviews/colleges/update_status',
                  data:formData,
                  cache: false,
                  contentType: false,
                  processData: false,
                  timeout: 60000000,
                  target: '.preview',
                  beforeSend:function(){
                    $('#btn_update_review_status').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
                  },
                  success:function(f){
                    if(f.success){
                     $('#btn_update_review_status').html('Update Status').prop('disabled',false);
                     Swal.fire({
                        icon: 'success',
                        title: f.success,
                        confirmButtonText:'Close',
                        confirmButtonColor:'#69da68',
                        allowOutsideClick: false,
                      });

                      window.location.reload();           
                    }else if(f.error){
                      $('#btn_update_review_status').html('Update Status').prop('disabled',false);
                      Swal.fire({
                        icon: 'error',
                        title: f.error,
                        confirmButtonText:'Close',
                        confirmButtonColor:'#69da68',
                        allowOutsideClick: false,
                      });
                    }else if(f.redirect){
                      $('#btn_update_review_status').html('Update Status').prop('disabled',false);
                      Swal.fire({
                        icon: 'info',
                        title: 'Your session expired',
                        confirmButtonText:'Close',
                        confirmButtonColor:'#69da68',
                        allowOutsideClick: false,
                      });
                    }
                  }
                });
              }
            });
      }
    });


});