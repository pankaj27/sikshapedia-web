jQuery(function($) {
  'use strict';


    $('#coupons_list_table').DataTable({ 
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
          "url": base_url+'/coupons/search',
          "type": "POST",
          "data":{[csrf_name]:csrf_hash}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
  });


    $('body').on('click','#btn_import_coupons',function(){
      $.ajax({
        type:'POST',
        url:base_url+'/coupons/import',
        data:{[csrf_name]:csrf_hash},
        beforeSend:function(){

        },
        success:function(d){

        },
        complete:function(xhr,ststus){
          var table=$('#coupons_list_table').DataTable();
          table.ajax.reload( null, false );
        }
      });
    });

});