jQuery(function($) {
  'use strict';

  //Countries
  $('#faculty_department_list_table').DataTable({ 
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
          "url": base_url+'/facultydepartments/search_faculty_departments',
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


  $('body').on('click','.btn_edit_department',function(){
    var dep_id=$(this).data('dep_id');
    var dep_name=$(this).data('dep_name');
    var dep_status=$(this).data('dep_status');

    $('#departmentsModal').find('#_department').val(dep_id);
    $('#departmentsModal').find('#department_name').val(dep_name);
    $('#departmentsModal').find('#department_status').val(dep_status).change();

    $('#departmentsModal').modal('show');
  });


  $('#departmentsModal').on('hidden.bs.modal', function () {
    $('#departmentsModal').find('#_department').val('');
    $('#departmentsModal').find('#department_name').val('');
    $('#departmentsModal').find('#department_status').val('1').change();
  });


  $('#form_faculty_departments').validate({
    rules:{
      department_name:{
        required:true
      }
    },
    messages:{
      department_name:{
        required:'Enter department name'
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
            url:base_url+'/facultydepartments/add_faculty_departments',
            data:$('#form_faculty_departments').serialize(),
            beforeSend:function(){
              $('#btn_add_faculty_department').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
              $('#btn_add_faculty_department').html('Save').prop('disabled',false);
              var table=$('#faculty_department_list_table').DataTable();
              table.ajax.reload( null, false );
            }
          });
        }
      });
    }
  });

});