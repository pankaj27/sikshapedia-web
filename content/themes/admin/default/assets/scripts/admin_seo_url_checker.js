jQuery(function($) {
  'use strict';

  // The DOM element you wish to replace with Tagify
  var input = document.querySelector('input[name=page_meta_keywords]');

  // initialize Tagify on the above input node reference
  new Tagify(input);

  $('#seo_url_list_table').DataTable({ 
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
        "url": base_url+'/seo/urlchecker_search',
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


  $('body').on('click','.btn_url_data_edit',function(){
    
    var url_id=$(this).data('url_id');
    $.ajax({
      type:'POST',
      url:base_url+'/seo/urlchecker_meta_load',
      data:{[csrf_name]:csrf_hash,url_id:url_id},
      success:function(d){
        $('#editURLMeta .modal-body').html(d.html);
      }
    });


    $('#editURLMeta').modal('show');
  });


});