jQuery(function($) {
  'use strict';

      $('#seo_college_strcu_data_list_table').DataTable({ 
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
            "url": base_url+'/seo/college_structured_data_search',
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



      $('body').on('click','.btn_edit_json_ld',function(){
        var _c=$(this).data('college_id');

        $.ajax({
          type:'POST',
          url:base_url+'/seo/colleges/metadata',
          data:{_college:_c,csrf_test_name:csrf_hash,data_edit_type:'page_struct_data'},
          beforeSend:function(){

          },
          success:function(d){
            if(d.html!=''){
              $('#meta_div').html(d.html);
            }
          }
        });

        $('#editCollegeStructureMetaModal').find('#editCollegeStructureMetaModalTitle').html($(this).attr('data-college_name'));
        
      });

});