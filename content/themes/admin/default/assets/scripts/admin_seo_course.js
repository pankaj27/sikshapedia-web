jQuery(function($) {
  'use strict';

  // The DOM element you wish to replace with Tagify
  var input = document.querySelector('input[name=page_meta_keywords]');

  // initialize Tagify on the above input node reference
  new Tagify(input);

    $('#seo_courses_list_table2').DataTable({ 
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
          "url": base_url+'/seo/courses/search',
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


    $('body').on('click','.btn_edit_course__meta',function(){
      var course_id=$(this).data('course_id');
      var course_name=$(this).data('course_name');
      $('#editCourseMenuMetaModal').find('#editCourseMenuMetaModalTitle').html(course_name+'- Edit Meta');
      $.ajax({
        type:'POST',
        url:base_url+'/seo/courses/search_coursemenu_data',
        data:{[csrf_name]:csrf_hash,course_id:course_id},
        success:function(d){
            $('#editCourseMenuMetaModal').find('#div_course_meta_body').html(d.html);
        }
      });
    });


    $('body').on('click','.btn_course_menu_structure_data',function(){
      var course_id=$(this).data('course_id');
      var course_menu_id=$(this).data('course_menu_id');
      //alert('Course id:'+course_id);

      $.ajax({
        type:'POST',
        url:base_url+'/seo/courses/search_coursemenu_struct_data',
        data:{[csrf_name]:csrf_hash,course_id:course_id,course_menu_id:course_menu_id},
        success:function(d){
          if(d.html){
            $('#editCourseMenuMetaStructuredDataModal2').find('#div_course_meta_strcture_data_body').html(d.html);
          }
        }
      });

      $('#editCourseMenuMetaStructuredDataModal2').modal('show');
    });


    


});