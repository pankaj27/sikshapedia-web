jQuery(function($) {
  'use strict';

  //Menues
  load_menues('top_menu');
  
  $('body').on('click','a.menu_type',function(){
    var menu_type=$(this).attr('data-menu_type');
    $('#'+menu_type+'_list_table').dataTable().fnDestroy();
    load_menues(menu_type);
  });

  $('#menu_upper_list_table').DataTable({ 
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
          "url": base_url+'/settings/menues/search',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,menu_is_upper_top:'1'}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
  });


  $('body').on('click','.btn_child_menu',function(){
    var parent_menu=$(this).attr('data-parent');
    var parent_this_menu=$(this).attr('data-parent_this');
    var parent_menu_name=$(this).attr('data-parent_name');

   
    $('#form_menues').find('#parent_menu_id').val(parent_menu);
    $('#childMenuModal').find('.modal-title').html(parent_menu_name);
    $('#childMenuModal').find('#child_menu_list_table').dataTable().fnClearTable();
    $('#childMenuModal').find('#child_menu_list_table').dataTable().fnDestroy();


    load_child_menues(parent_menu);

    $('#form_menues_next').find('#parent_menu_id_next').val(parent_menu);
    $('#nextchildMenuModal').find('.modal-title').html(parent_menu_name);
    $('#nextchildMenuModal').find('#next_child_menu_list_table').dataTable().fnClearTable();
    $('#nextchildMenuModal').find('#next_child_menu_list_table').dataTable().fnDestroy();


    load_next_child_menues(parent_menu);
  });


  function load_menues(menu_type,parent_menu=0){
    var menu_is_upper_top='';
   // alert(menu_type);
    if(menu_type=='top_menu'){
      menu_is_upper_top='1';
    }else{
      menu_is_upper_top='2';
    }

    console.log(menu_is_upper_top);

    $('#'+menu_type+'_list_table').DataTable({ 
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
          "url": base_url+'/settings/menues/search',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,parent_menu:parent_menu,menu_is_upper_top:menu_is_upper_top}
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

  function load_child_menues(parent_menu){
    $('#child_menu_list_table').DataTable({ 
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
            "url": base_url+'/settings/menues/search',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,parent_menu:parent_menu}
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

  function load_next_child_menues(parent_menu){
    $('#next_child_menu_list_table').DataTable({ 
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
            "url": base_url+'/settings/menues/search',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,parent_menu:parent_menu}
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


 





});