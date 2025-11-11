jQuery(function($) {
  'use strict';

  //Countries
  $('#affiliation_list_table').DataTable({ 
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
          "url": base_url+'/affiliations/search_affiliations',
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


  $('body').on('click','.btn_edit_affiliations',function(){
    var statutory_body_id=$(this).data('statutory_body_id');
    var statutory_body_name=$(this).data('statutory_body_name');
    var statutory_abbr_name=$(this).data('statutory_abbr_name');
    var statutory_body_status=$(this).data('statutory_body_status');

    $('#affiliationsModal').find('#_affiliation').val(statutory_body_id);
    $('#affiliationsModal').find('#affiliation_name').val(statutory_body_name);
    $('#affiliationsModal').find('#affiliation_abbr_name').val(statutory_abbr_name);
    $('#affiliationsModal').find('#affiliation_status').val(statutory_body_status).change();

    $('#affiliationsModal').modal('show');
  });


  $('#affiliationsModal').on('hidden.bs.modal', function () {
    $('#affiliationsModal').find('#_affiliation').val('');
    $('#affiliationsModal').find('#affiliation_name').val('');
    $('#affiliationsModal').find('#affiliation_abbr_name').val('');
    $('#affiliationsModal').find('#affiliation_status').val(1).change();
  });


  $('#form_affiliations').validate({
    rules:{
      affiliation_name:{
        required:true
      },
      affiliation_abbr_name:{
        required:true
      }
    },
    messages:{
      affiliation_name:{
        required:'Enter affiliation name'
      },
      affiliation_abbr_name:{
        required:'Enter affiliation abbriviation'
      }
    },
    submitHandler:function(){
      Swal.fire({
        title: "Do you want to add the data?",
        text: "You can edit data later!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69da68',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value){
          $.ajax({
            type:'POST',
            url:base_url+'/affiliations/add_affiliations',
            data:$('#form_affiliations').serialize(),
            beforeSend:function(){
              $('#btn_add_affiliation').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
            complete:function(xhr,status){
              $('#btn_add_affiliation').html('Save').prop('disabled',false);
              var table=$('#affiliation_list_table').DataTable();
              table.ajax.reload( null, false );
            }
          });
        }
      });
    }
  });

});