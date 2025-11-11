jQuery(function($) {
  'use strict';

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");

  $('#campaign_contact_list_table').DataTable({ 
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
        "url": base_url+'/search_emailcampaigns_data',
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


  $('#campaign_list_table').DataTable({ 
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
        "url": base_url+'/search_emailcampaigns',
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


// $('#campaign_contact_list_table').DataTable({ 
//     'bJQueryUI': false,
//     'stateSave': true,
//     'iDisplayLength':50,
//     'responsive': true,
//     "pagingType": "full_numbers",
//     'language': {
//       'paginate': {
//         'first': "<<", // This is the link to the first page
//         'previous': "<", // This is the link to the previous page
//         'next': ">", // This is the link to the next page
//         'last': ">>" // This is the link to the last page
//       }
//     },
//     "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
//     "processing": true, //Feature control the processing indicator.
//     "serverSide": true, //Feature control DataTables' server-side processing mode.
//     "order": [], //Initial no order.
//     // Load data for the table's content from an Ajax source
//     "ajax": {
//         "url": base_url+'/search_emailcampaigns',
//         "type": "POST",
//         "data":{csrf_test_name:csrf_hash}
//     },
//     //Set column definition initialisation properties.
//     "columnDefs": [
//     { 
//         "targets": [ 0 ], //first column / numbering column
//         "orderable": false, //set not orderable
//     },
//     ],
// });

  $('body').on('click','#btn_send_mail',function(){
    $.ajax({
      type:'POST',
      url:base_url+'/send_emailcampaigns',
      data:{[csrf_name]:csrf_hash},
      success:function(d){
        
      }
    });
  });

  $('body').on('click','.btn_send_campaign_mail',function(){
    var campaign_id=$(this).data('campaign_id');
    $.ajax({
      type:'POST',
      url:base_url+'/send_emailcampaigns',
      data:{[csrf_name]:csrf_hash,campaign_id:campaign_id},
      beforeSend:function(){
        $(this).prop('disabled',true);
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
          var table=$('#campaign_list_table').DataTable();
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
  });


$('#form_campaign_contact_data').validate({
  rules:{
    contact_firstname:{
      required:true
    },
    contact_lastname:{
      required:true
    },
    contact_country:{
      valueNotEquals:'0'
    },
    contact_phone:{
      required:true,
      digits:true,
      minlength:10,
      maxlength:10
    }
  },
  messages:{
    contact_firstname:{
      required:'Enter firstname'
    },
    contact_lastname:{
      required:'Enter lastname'
    },
    contact_country:{
      valueNotEquals:'Select country code'
    },
    contact_phone:{
      required:'Enter Phone No'
    }
  },
  submitHandler:function(){
      Swal.fire({   
        title: "Are you sure?",   
        text: "You will be able to edit later",   
        icon: 'warning',  
        showCancelButton: true,   
        confirmButtonColor: '#3085d6', 
        cancelButtonColor: '#d33', 
        confirmButtonText: "Yes, Update",   
        cancelButtonText: "No, cancel",
        allowOutsideClick: false
    }).then((isConfirm)=>{

      //console.log(isConfirm);

      if (isConfirm){

        var formData=new FormData($('#form_campaign_contact_data')[0]);

        $.ajax({
          type:'POST',
          url:base_url+'/seo/courses/add_meta',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          beforeSend:function(){
            $('#').html('<span class="fa fa-circle-o-notch fa-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(d){
            if(d.success){
              Swal.fire({
                icon: 'success',
                title: d.success,
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
              });


            }else if(d.error){
              Swal.fire({
                icon: 'error',
                title: d.error,
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
              });
            }
          },
          complete:function(status,xhr){
          }
        });

      }


    });
  }
});



 if($('#campaign_start').length) {

    $("#campaign_start").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });
  }


  if($('#campaign_end').length) {

    $("#campaign_end").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });
  }


  if($('#campaign_schedule_time').length) {

    $("#campaign_schedule_time").flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i"
    });
  }



$('#form_campaign_add_edit_new').validate({
  rules:{

  },
  messages:{

  },
  submitHandler:function(){

    var formData=new FormData($('#form_campaign_add_edit_new')[0]);
    formData.append('campaign_type','email');
    $.ajax({
          type:'POST',
          url:base_url+'/create_emailcampaigns',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          beforeSend:function(){
            //$('#').html('<span class="fa fa-circle-o-notch fa-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(d){
            if(d.success){
              Swal.fire({
                icon: 'success',
                title: d.success,
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
              });


            }else if(d.error){
              Swal.fire({
                icon: 'error',
                title: d.error,
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
              });
            }
          },
          complete:function(status,xhr){
          }
        });
  }
});



});