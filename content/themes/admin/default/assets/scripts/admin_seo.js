jQuery(function($) {
  'use strict';

   $("#page_country").chosen({no_results_text: "Select Country"});
    $("#page_state").chosen({no_results_text: "Select State"});
     $("#page_city").chosen({no_results_text: "Select City"});
      $("#college_state").chosen({no_results_text: "Select State"});

      
 

 


  $('#seo_college_list_table').DataTable({ 
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
            "url": base_url+'/seo/colleges/search',
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


  $('#seo_courses_list_table').DataTable({ 
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



  //Exams
  $('#seo_exam_list_table').DataTable({ 
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
        "url": base_url+'/seo/exams/search',
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

  $('body').on('click','.btn_update_exam_url_meta',function(){
    var exam_id=$(this).data('exam_id');
    var exam_menu=$(this).data('exam_menu');
    var exam_menu_id=$(this).data('exam_menu_id');
    var exam_menu_url=$(this).data('url');
    $('#form_exam_meta_update_div').find('#_exam').val(exam_id);
    $('#form_exam_meta_update_div').find('#_exam_url').val(exam_menu_url);
    $('#form_exam_meta_update_div').find('#form_heading').val(exam_menu);
    $('#form_exam_meta_update_div').find('#_exam_menu_id').val(exam_menu_id);
    $('#form_exam_meta_update_div').find('#exam_page_url').val(exam_menu_url);
    $('#form_exam_meta_update_div').css('display','block');
    $('#exam_slugs_urls_div').css('display','none');
  });

  $('body').on('click','#btn_close_form',function(){
    $('#form_exam_meta_update_div').css('display','none');
    $('#exam_slugs_urls_div').css('display','block');
  });

  $('#form_exam_metadata_update').validate({
    rules:{
      exam_page_heading:{
        required:true
      },
      exam_meta_title:{
        required:true
      },
      exam_meta_keywords:{
        required:true
      },
      exam_meta_desc:{
        required:false
      },
      exam_og_title:{
        required:true
      },
      exam_og_desc:{
        required:false
      }
    },
    messages:{
      exam_page_heading:{
        required:'Enter page heading'
      },
      exam_meta_title:{
        required:'Please enter meta title'
      },
      exam_meta_keywords:{
        required:'Please enter meta keywords'
      },
      exam_meta_desc:{
        required:'Please enter meta description'
      },
      exam_og_title:{
        required:'Please enter og title'
      },
      exam_og_desc:{
        required:'Please enter og description'
      }
    },
    submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/seo/exams/add_meta',
          data:$('#form_exam_meta_update').serialize(),
          beforeSend:function(){
            $('#btn_update_exam_url_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
              var table=$('#exam_slugs_urls').DataTable();
              table.ajax.reload( null, false );
              $('#form_exam_meta_update_div').css('display','none');
              $('#exam_slugs_urls_div').css('display','block');
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
          complete:function(){
            $('#btn_update_exam_url_meta').html('Update').prop('disabled',false);
          }
        });
      }
  });

  $('#form_exam_meta').validate({
    rules:{
     exam_page_heading:{
        required:true
      },
      exam_meta_title:{
        required:true
      },
      exam_meta_keywords:{
        required:true
      },
      exam_meta_desc:{
        required:false
      },
      exam_og_title:{
        required:true
      },
      exam_og_desc:{
        required:false
      }
    },
    messages:{
      exam_page_heading:{
        required:'Enter page heading'
      },
      exam_meta_title:{
        required:'Please enter meta title'
      },
      exam_meta_keywords:{
        required:'Please enter meta keywords'
      },
      exam_meta_desc:{
        required:'Please enter meta description'
      },
      exam_og_title:{
        required:'Please enter og title'
      },
      exam_og_desc:{
        required:'Please enter og description'
      }
    },
    submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/seo/exams/add_meta',
          data:$('#form_exam_meta').serialize(),
          beforeSend:function(){
            $('#btn_update_exam_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
              var table=$('#seo_exam_list_table').DataTable();
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
          },
          complete:function(){
            $('#btn_update_exam_meta').html('Update').prop('disabled',false);
          }
        });
      }
  });

  //Exams



  $('#slug_list_table').DataTable({ 
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
            "url": base_url+'/seo/search_urls',
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

 var input_tagify='';

  $('body').on('click','.btn_edit_meta',function(){
    var _c=$(this).attr('data-college_user');
    $.ajax({
      type:'POST',
      url:base_url+'/seo/colleges/metadata',
      data:{_college:_c,csrf_test_name:csrf_hash},
      beforeSend:function(){
         $('#meta_div').html('');
      },
      success:function(d){
        if(d.html!=''){
          $('#meta_div').html(d.html);          
        }
      },complete:function(xhr,status){
        // The DOM element you wish to replace with Tagify
        // var keywordInputs = document.querySelector('input[name=college_meta_keywords]');
        // // Iterate over each textarea and initialize Tagify
        // new Tagify(keywordInputs);
      }
    });
  	$('#editCollegeMetaModal').find('#_college').val($(this).attr('data-college_user'));
  	$('#editCollegeMetaModal').find('#college_meta_title').val($(this).attr('data-meta_title'));
  	$('#editCollegeMetaModal').find('#college_meta_keywords').val($(this).attr('data-meta_keywords'));
  	$('#editCollegeMetaModal').find('#college_meta_desc').val($(this).attr('data-meta_desc'));
  	$('#editCollegeMetaModal').find('#college_og_title').val($(this).attr('data-meta_og_title'));
  	$('#editCollegeMetaModal').find('#college_og_desc').val($(this).attr('data-meta_og_desc'));

  	$('#editCollegeMetaModal').find('#editCollegeMetaModalTitle').html($(this).attr('data-college_name'));

  });

  // $('body').on('click','.inner_menu_link',function(){
  //   var keywordInputs = document.querySelector('input[name=college_meta_keywords]');
  //   // Iterate over each textarea and initialize Tagify
  //   keywordInputs.destroy();
  //   new Tagify(keywordInputs);
  // });

  $('body').on('click','.btn_edit_exam_meta',function(){
    $('#editExamMetaModal').find('#exam_page_url').val($(this).attr('data-url'));
    $('#editExamMetaModal').find('#_exam_stream').val($(this).attr('data-exam_stream_id'));
    $('#editExamMetaModal').find('#_exam').val($(this).attr('data-exam_id'));
    $('#editExamMetaModal').find('#exam_page_heading').val($(this).attr('data-page_heading'));
    $('#editExamMetaModal').find('#exam_meta_title').val($(this).attr('data-meta_title'));
    $('#editExamMetaModal').find('#exam_meta_keywords').text($(this).attr('data-meta_keywords'));
    $('#editExamMetaModal').find('#exam_meta_desc').val($(this).attr('data-meta_desc'));
    $('#editExamMetaModal').find('#exam_og_title').val($(this).attr('data-meta_og_title'));
    $('#editExamMetaModal').find('#exam_og_desc').val($(this).attr('data-meta_og_desc'));

    $('#editExamMetaModal').find('#editExamMetaModalTitle').html('<a href="'+$(this).attr('data-url')+'" target="_blank">'+$(this).attr('data-exam_name')+'</a>');

  });

  $('body').on('click','.btn_edit_exam_meta2',function(){
    $('#editExamMetaModal2').find('#exam_page_url').val($(this).attr('data-url'));
    $('#editExamMetaModal2').find('#_exam_stream').val($(this).attr('data-exam_stream_id'));
    $('#editExamMetaModal2').find('#_exam').val($(this).attr('data-exam_id'));
    $('#editExamMetaModal2').find('#exam_page_heading').val($(this).attr('data-page_heading'));
    $('#editExamMetaModal2').find('#exam_meta_title').val($(this).attr('data-meta_title'));
    $('#editExamMetaModal2').find('#exam_meta_keywords').text($(this).attr('data-meta_keywords'));
    $('#editExamMetaModal2').find('#exam_meta_desc').val($(this).attr('data-meta_desc'));
    $('#editExamMetaModal2').find('#exam_og_title').val($(this).attr('data-meta_og_title'));
    $('#editExamMetaModal2').find('#exam_og_desc').val($(this).attr('data-meta_og_desc'));

    $('#editExamMetaModal2').find('#editExamMetaModalTitle').html('<a href="'+$(this).attr('data-url')+'" target="_blank">'+$(this).attr('data-exam_name')+'</a>');
    $.ajax({
      type:'POST',
      url:base_url+'/seo/exams/searchurlsmeta',
      data:{[csrf_name]:csrf_hash,exam_id:$(this).attr('data-exam_id'),exam_menu_id:$(this).attr('data-exam_menu_id'),exam_slug_url:$(this).attr('data-url')},
      beforeSend:function(){

      },
      success:function(d){
        $('#editExamMetaModal2 .modal-body').html(d.html);
      }
    });

    $('#editExamMetaModal2').modal('show');
  });


  $('body').on('click','.btn_editcourse__meta',function(){
    
    $('#editCourseMetaModal').find('#course_page_url').val($(this).attr('data-url'));
    $('#editCourseMetaModal').find('#_course').val($(this).attr('data-course_id'));
    $('#editCourseMetaModal').find('#course_page_heading').val($(this).attr('data-meta_heading'));
    $('#editCourseMetaModal').find('#course_meta_title').val($(this).attr('data-meta_title'));
    $('#editCourseMetaModal').find('#course_meta_keywords').val($(this).attr('data-meta_keywords'));
    $('#editCourseMetaModal').find('#course_meta_desc').val($(this).attr('data-meta_desc'));
    $('#editCourseMetaModal').find('#course_og_title').val($(this).attr('data-meta_og_title'));
    $('#editCourseMetaModal').find('#course_og_desc').val($(this).attr('data-meta_og_desc'));

    $('#editCourseMetaModal').find('#editCourseMetaModalTitle').html('<a href="'+$(this).attr('data-url')+'" target="_blank">'+$(this).attr('data-course_name')+'</a>');
  });


  $('#editCollegeMetaModal').on('show.bs.modal', function () {
    var c=$('#editCollegeMetaModal').find('#_college').val();


  });

  $('#form_college_meta').validate({
  	rules:{
  		college_meta_title:{
  			required:true
  		},
  		college_meta_keywords:{
  			required:true
  		},
  		college_meta_desc:{
  			required:false
  		},
  		college_og_title:{
  			required:true
  		},
  		college_og_desc:{
  			required:false
  		}
  	},
  	messages:{
  		college_meta_title:{
  			required:'Please enter meta title'
  		},
  		college_meta_keywords:{
  			required:'Please enter meta keywords'
  		},
  		college_meta_desc:{
  			required:'Please enter meta description'
  		},
  		college_og_title:{
  			required:'Please enter og title'
  		},
  		college_og_desc:{
  			required:'Please enter og description'
  		}
  	},
  	submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/seo/colleges/add_meta',
          data:$('#form_college_meta').serialize(),
          beforeSend:function(){
            $('#btn_update_college_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
              var table=$('#seo_college_list_table').DataTable();
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
          },
          complete:function(){
            $('#btn_update_college_meta').html('Update').prop('disabled',false);
          }
        });
      }
  });

  $('#form_course_meta').validate({
    rules:{
      course_page_heading:{
        required:true
      },
      coourse_meta_title:{
        required:true
      },
      coourse_meta_keywords:{
        required:true
      },
      coourse_meta_desc:{
        required:false
      },
      coourse_og_title:{
        required:true
      },
      coourse_og_desc:{
        required:false
      }
    },
    messages:{
      course_page_heading:{
        required:'Enter page heading'
      },
      course_meta_title:{
        required:'Please enter meta title'
      },
      course_meta_keywords:{
        required:'Please enter meta keywords'
      },
      course_meta_desc:{
        required:'Please enter meta description'
      },
      course_og_title:{
        required:'Please enter og title'
      },
      course_og_desc:{
        required:'Please enter og description'
      }
    },
    submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/seo/courses/add_meta',
          data:$('#form_course_meta').serialize(),
          beforeSend:function(){
            $('#btn_update_course_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
              var table=$('#seo_courses_list_table').DataTable();
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
          },
          complete:function(){
            $('#btn_update_course_meta').html('Update').prop('disabled',false);
          }
        });
      }
  });



  $('body').on('click','.btn_generate_course_meta',function(){

    var slug_type=$(this).attr('data-slug_type');
    var slug_type_id=$(this).attr('data-course_id');


    $.ajax({
      type:'POST',
      url:base_url+'/seo/generate_meta',
      data:{csrf_test_name:csrf_hash,slug_type:slug_type,slug_type_id:slug_type_id},
      beforeSend:function(){
        $(this).html('Generating...');        
      },
      success:function(d){
        if(d.success){
          var table=$('#seo_courses_list_table').DataTable();
          table.ajax.reload( null, false );
        }          
      },
      complete:function(){
        var table=$('#seo_courses_list_table').DataTable();
          table.ajax.reload( null, false );
      }
    });


  });


  $('body').on('change','#page_state',function(){
    let country = $('#page_country :selected').val();
    let state   = $('#page_state :selected').val();
    let f_data  =   new Array(country,state);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_cities',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#page_city').html(d.html);
        $("#page_city").trigger("chosen:updated");
      }
    }); 
  });

  $('body').on('change','#page_stream',function(){
    let stream = $('#page_stream :selected').val();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_courses',
      data:{_stream:stream,csrf_test_name:csrf_hash},
      success:function(d){
        $('#page_course').html(d.html);
        $("#page_city").trigger("chosen:updated");
      }
    }); 
  });


  $('body').on('click','#view_slug',function(){
    var page_country=$('#page_country :selected').val();
    var page_state=$('#page_state :selected').val();
    var page_city=$('#page_city :selected').val();
    var page_type=$('#page_type :selected').val();
    var page_stream=$('#page_stream :selected').val();
    var page_course=$('#page_course :selected').val();

    $.ajax({
      type:'POST',
      url:base_url+'/seo/get_urls',
      data:{csrf_test_name:csrf_hash,page_country:page_country,page_state:page_state,page_city:page_city,page_type:page_type,page_stream:page_stream,page_course:page_course},
      beforeSend:function(){
        $('#view_slug').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        $('#slug_list_table tbody').html(d.html);
      },
      complete:function(xhr,status){
        $('#view_slug').html('View').prop('disabled',false);
      }
    });


  });


  $('body').on('click','#generate_slug',function(){
    var page_country=$('#page_country :selected').val();
    var page_state=$('#page_state :selected').val();
    var page_city=$('#page_city :selected').val();
    var page_type=$('#page_type :selected').val();
    var page_stream=$('#page_stream :selected').val();
    var page_course=$('#page_course :selected').val();

    $.ajax({
      type:'POST',
      url:base_url+'/seo/generate_type_urls',
      data:{csrf_test_name:csrf_hash,page_country:page_country,page_state:page_state,page_city:page_city,page_type:page_type,page_stream:page_stream,page_course:page_course},
      beforeSend:function(){
        $('#generate_slug').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
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
          

        //$('#view_slug').click();
      },
      complete:function(xhr,status){
        $('#generate_slug').html('Generate').prop('disabled',false);
        var table=$('#slug_list_table').DataTable();
        table.ajax.reload( null, false );
      }
    });
  });


  $('body').on('click','#generate_slug_other_types',function(){
    var page_country=$('#page_country :selected').val();
    var page_state=$('#page_state :selected').val();
    var page_city=$('#page_city :selected').val();
    var page_type=$('#page_type :selected').val();
    var page_stream=$('#page_stream :selected').val();
    var page_course=$('#page_course :selected').val();


    var affiliation_type=$('#affiliation_type').val();
    var inst_type=$('#inst_type').val();
    var inst_category=$('#inst_category').val();
    var ranking_agency=$('#ranking_agency').val();

    $.ajax({
      type:'POST',
      url:base_url+'/seo/generate_other_type_urls',
      data:{
        csrf_test_name:csrf_hash,
        page_country:page_country,
        page_state:page_state,
        page_city:page_city,
        page_type:page_type,
        page_stream:page_stream,
        page_course:page_course,
        inst_category:inst_category,
        ranking_agency:ranking_agency,
        inst_type:inst_type,
        affiliation_type:affiliation_type
      },
      beforeSend:function(){
        $('#generate_slug_other_types').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
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
          

        //$('#view_slug').click();
      },
      complete:function(xhr,status){
        $('#generate_slug_other_types').html('Generate').prop('disabled',false);
        var table=$('#slug_list_table').DataTable();
        table.ajax.reload( null, false );
      }
    });
  });


  $("#check_seo_college").click(function(){
    $('input:checkbox').not(this).prop('checked', this.checked);

    if(this.checked){
      // alert('hi');
      $('#btn_gen_url').css('display','block');
    }else{
      // alert('hi2');
      $('#btn_gen_url').css('display','none');
    }
  });

  $('.slug_type_ids').click(function(){
    //$('input:checkbox').not(this).prop('checked', this.checked);

    if(this.checked){
      // alert('hi');
      $('#btn_gen_url').css('display','block');
    }else{
      // alert('hi2');
      $('#btn_gen_url').css('display','none');
    }
  });

  $('.slug_type_ids').click(function () {
    if(this.length>0){
      // alert('hi');
      $('#btn_gen_url').css('display','block');
    }else{
      // alert('hi2');
      $('#btn_gen_url').css('display','none');
    }
  });

  $('body').on('click','#_btn_gen_url',function(){

   

    // var array = new Array();
    // $("input:checked").each(function() {
    //     array.push($(this).val());
    // });

    var slug_type_array_ids = $.map($(':checkbox[name=slug_type_ids\\[\\]]:checked'), function(n, i){
        return n.value;
    }).join(',');



    $.ajax({
      type:'POST',
      url:base_url+'/seo/generate_bulk_url',
      data:{user_type:'college_static_url',slug_type_array_ids:slug_type_array_ids,csrf_test_name:csrf_hash},
      beforeSend:function(){
        $('#btn_gen_url').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        Swal.fire({
          icon: 'success',
          title: d.success,
          confirmButtonText:'Close',
          confirmButtonColor:'#69da68',
          allowOutsideClick: false,
        });
      },
      complete:function(xhr,status){
        $('#btn_gen_url').html('Generate').css('display','none');
        var table=$('#seo_college_list_table').DataTable();
        table.ajax.reload( null, false );
        window.location.reload();
      }
    });

  });

   $('body').on('click','#_btn_gen_searchdata',function(){

   

    // var array = new Array();
    // $("input:checked").each(function() {
    //     array.push($(this).val());
    // });

    var search_type_ids = $.map($(':checkbox[name=search_type_ids\\[\\]]:checked'), function(n, i){
        return n.value;
    }).join(',');



    $.ajax({
      type:'POST',
      url:base_url+'/institutions/colleges/send_to_search',
      data:{data_type:'college',search_type_ids:search_type_ids,csrf_test_name:csrf_hash},
      beforeSend:function(){
        $('#_btn_gen_searchdata').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        Swal.fire({
          icon: 'success',
          title: d.success,
          confirmButtonText:'Close',
          confirmButtonColor:'#69da68',
          allowOutsideClick: false,
        });
      },
      complete:function(xhr,status){
        $('#_btn_gen_searchdata').html('Generate Search Data').prop('disabled',false);
        var table=$('#seo_college_list_table').DataTable();
        table.ajax.reload( null, false );
        //window.location.reload();
      }
    });

  });

  $('body').on('click','.btn_generate_slug',function(){

   

    // var array = new Array();
    // $("input:checked").each(function() {
    //     array.push($(this).val());
    // });

    var slug_type_array_ids = $(this).attr('data-college_id');



    $.ajax({
      type:'POST',
      url:base_url+'/seo/generate_bulk_url',
      data:{user_type:'college_static_url',slug_type_array_ids:slug_type_array_ids,csrf_test_name:csrf_hash},
      beforeSend:function(){
        $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        // Swal.fire({
        //   icon: 'success',
        //   title: d.success,
        //   confirmButtonText:'Close',
        //   confirmButtonColor:'#69da68',
        //   allowOutsideClick: false,
        // });
      },
      complete:function(xhr,status){
        $(this).html('Generate').css('display','none');
        var table=$('#seo_college_list_table').DataTable();
        table.ajax.reload( null, false );
        //window.location.reload();
      }
    });

  });

  $('body').on('click','#btn_generate_sitemap',function(){
    var site_map_type=$('#site_map_type option:selected').val();
    $.ajax({
      type:'POST',
      url:base_url+'/seo/generate_sitemap',
      data:{[csrf_name]:csrf_hash,site_map_type:site_map_type},
      beforeSend:function(){
        $('#btn_generate_sitemap').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        Swal.fire({
          icon: 'success',
          title: d.success,
          confirmButtonText:'Close',
          confirmButtonColor:'#69da68',
          allowOutsideClick: false,
        });
      },
      complete:function(xhr,status){
        $('#btn_generate_sitemap').html('Generate Sitemap').prop('disabled',false);
       window.location.reload();
      }
    });
  });

   $('body').on('click','#btn_generate_sitemap_index',function(){
    $.ajax({
      type:'POST',
      url:base_url+'/seo/generate_sitemap_index',
      data:{[csrf_name]:csrf_hash},
      beforeSend:function(){
        $('#btn_generate_sitemap_index').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        Swal.fire({
          icon: 'success',
          title: d.success,
          confirmButtonText:'Close',
          confirmButtonColor:'#69da68',
          allowOutsideClick: false,
        });
      },
      complete:function(xhr,status){
        $('#btn_generate_sitemap_index').html('Generate Sitemap').prop('disabled',false);
        setTimeout(function(){
          window.location.reload();
        },5000);
       
      }
    });
  });


  // $( "#examUrls" ).on('shown', function(){
  // });


  $('body').on('click','.btn_edit_exam_slug',function(){
    var exam_id=$(this).data('exam_id');

    $('#exam_slugs_urls').DataTable().destroy();

    $('#exam_slugs_urls').DataTable({ 
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
          "url": base_url+'/seo/exams/searchurls',
          "type": "POST",
          "data":{[csrf_name]:csrf_hash,exam_id:exam_id}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 2 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
  });

  });


  

});