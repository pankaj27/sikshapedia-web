jQuery(function($) {
  'use strict';

  load_seo_images('user_logo');

  function load_seo_images(image_type){
    $('#seo_image_list_table').DataTable({ 
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
        "url": base_url+'/settings/browser/search_storage_data',
        "type": "POST",
        "data":{csrf_test_name:csrf_hash,application_type:'seo_update',image_type:image_type}
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

  


  $('body').on('change','#seo_image_list_select',function(){
    // var table=$('#seo_image_list_table').DataTable();
    // table.ajax.reload( null, false );
    $('#seo_image_list_table').DataTable().destroy();
    var image_type=$('#seo_image_list_select :selected').val();
    load_seo_images(image_type);
  });

   $('body').on('click','.data_update_image_data',function(){
    var storage_id=$(this).data('storage_id');

    $('#imageSEOQuickUpdateModal').find('#image_storage_id').val(storage_id);

    $('#imageSEOQuickUpdateModal').modal('show');
   });


   $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });
  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  });

});