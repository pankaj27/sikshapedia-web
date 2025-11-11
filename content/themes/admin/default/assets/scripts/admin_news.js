jQuery(function($) {
  'use strict';

  // $("#news_country").chosen({no_results_text: "Select Country"});

  // $("#news_category").chosen({no_results_text: "Select Category"});
  // $("#news_is_featured").chosen({no_results_text: "Select Category"});
  // $("#news_publish").chosen({no_results_text: "Select Category"});

  $('#news_list_table').DataTable({ 
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
        "url": base_url+'/news/search',
        "type": "POST",
        "data":{csrf_test_name:csrf_hash,news_type:news_type,news_types_id:news_types_id}
    },
    //Set column definition initialisation properties.
    "columnDefs": [
    { 
        "targets": [ 0 ], //first column / numbering column
        "orderable": false, //set not orderable
    },
    ],
  });

  // if ($(".news_content").length) {
  //   tinymce.init({
  //     selector: '.news_content',
  //     setup: function (editor) {
  //         editor.on('change', function () {
  //             tinymce.triggerSave();
  //         });
  //     },
  //     entity_encoding : "raw",
  //     height: 400,
  //     theme: 'silver',
  //     plugins: [
  //       'advlist autolink lists link image charmap print preview hr anchor pagebreak',
  //       'searchreplace wordcount visualblocks visualchars code fullscreen',
  //     ],
  //     toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  //     toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
  //     target_list: false,
  //     image_advtab: true,
  //     templates: [{
  //         title: 'Test template 1',
  //         content: 'Test 1'
  //       },
  //       {
  //         title: 'Test template 2',
  //         content: 'Test 2'
  //       }
  //     ],
  //     content_css: []
  //   });
  // }

   if ($(".news_content").length) {

    var fetchLinkLists = function() {
      return [
        {title: 'My page 1', value: 'https://www.tiny.cloud'},
        {title: 'My page 2', value: 'https://about.tiny.cloud'}
      ]
    };
    tinymce.init({
      selector: '.news_content',
      deprecation_warnings: false,
      menubar: 'insert',
      setup: function (editor) {
          editor.on('change', function () {
              tinymce.triggerSave();
          });
      },
      entity_encoding : "raw",
      height: 400,
      theme: 'silver',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code',
      ],
      toolbar_mode: 'floating',
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
      table_appearance_options: true,
      table_use_colgroups: true,
      link_quicklink: true,
      default_link_target: '_blank',
      link_context_toolbar: true,
      link_default_protocol: 'https',
      rel_list: [
        {title: 'No Referrer', value: 'noreferrer'},
        {title: 'External Link', value: 'external'}
      ],
      link_list: function(success) { // called on link dialog open
        var links = fetchLinkList(); // get link_list data
        success(links); // pass link_list data to TinyMCE
      },
      image_advtab: true,
      templates: [{
          title: 'Test template 1',
          content: 'Test 1'
        },
        {
          title: 'Test template 2',
          content: 'Test 2'
        }
      ],
      content_css: []
    });
  }

  $('#form_news_add_edit').validate({
    rules:{
      news_title:{
        required:true
      }
    },
    submitHandler:function(){



      $.ajax({
          type:'POST',
          url:base_url+'/news/add_news',
          data:new FormData($('#form_news_add_edit')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_save_news').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_save_news').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });            
            }else if(f.error){
              $('#btn_save_news').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_news').prop('disabled',true);
              Swal.fire({
                icon: 'info',
                title: 'Your session expired',
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }
          },
          xhr: function(){
              //Get XmlHttpRequest object
               var xhr = $.ajaxSettings.xhr() ;
              //Set onprogress event handler
               xhr.upload.onprogress = function(data){
                  var perc =(data.loaded / data.total) * 100;// Math.round((data.loaded / data.total) * 100);
                  $('.progress-bar').css('width',perc.toFixed(2) + '%').text(perc.toFixed(2) + '%');
               };
               return xhr ;
          },
          error: function (e) {
          },
          complete:function(status,xhr){
            $('.progress-bar').css('width', '0%').text('0%');
            $('#btn_save_news').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('body').on('click','.btn_del_news',function(){
    var nid=$(this).attr('data-aid');
    var news_types_id=$(this).attr('data-news_types_id');
    var news_type=$(this).attr('data-news_type');

    $.ajax({
      type:'POST',
      url:base_url+'/news/delete_news',
      data:{csrf_test_name:csrf_hash,news_id:nid,news_type:news_type,news_types_id:news_types_id},
      success:function(d){
        if(d.success){
          Swal.fire({
            icon: 'success',
            title: d.success,
            confirmButtonText:'Close',
            confirmButtonColor:'#69da68',
            allowOutsideClick: false,
          });
        }else if(d.error){
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
         var table=$('#news_list_table').DataTable();
          table.ajax.reload( null, false );
      }
    });
  });

   $("#news_category_type_value").chosen({no_results_text: "Select.."});


  $('body').on('change','#news_category',function(){
    //loadnews_category_types($('#news_category :selected').val(),$('#news_country :selected').val());
  });

  $('body').on('change','#news_country',function(){
    //loadnews_category_types($('#news_category :selected').val(),$('#news_country :selected').val());
  });

  function loadnews_category_types(type,type_country){

    if(type=='1'){
      $('#category_type_row').css('display','block');
      $('#category_type_row').find('#category_type_label').html('Select College');
      $.ajax({
        type:'POST',
        url:base_url+'/country/get_colleges',
        data:{csrf_test_name:csrf_hash,country_id:type_country,view_param:'json'},
        beforeSend:function(){
          $('#category_type_row').find('#category_type_label').html('Colleges are loading.....');
        },
        success:function(d){
          $('#category_type_row').find('#category_type_label').html('Select College');
          if(d.colleges){           

            if(type_country!=0 && type!=0){
              var html='';

              $.each(d.colleges,function(k,v){
                html+='<option value="'+v.college_id+'">'+v.college_name+'</option>';
              });

              $('#news_category_type_value').html(html);
              $('#news_category_type_value').trigger("chosen:updated");
              
            }
            
          }
        }
      });
    }else if(type=='2'){
      
    }else if(type=='3'){
      $.ajax({
        type:'POST',
        url:base_url+'/exams/get_exams',
        data:{csrf_test_name:csrf_hash,country_id:type_country},
        success:function(d){
          if(d.exams){           

            if(type_country!=0 && type!=0){

              var html='';

              $.each(d.exams,function(k,v){
                html+='<option value="'+v.exam_id+'">'+v.exam_name+'</option>';
              });


              $('#news_category_type_value').html(html);
              $('#news_category_type_value').trigger("chosen:updated");
              $('#category_type_row').css('display','block');
              $('#category_type_row').find('#category_type_label').html('Select Exam');
            }
            
          }
        }
      });
    }else if(type=='4'){

    }

  }


  jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
  }, "Letters, numbers, and underscores only please");

  // Applying perfect-scrollbar 
  if ($('.chat-aside .tab-content').length) {
    const sidebarBodyScroll = new PerfectScrollbar('.chat-aside .tab-content');
  }
  if ($('.chat-content .chat-body').length) {
    const sidebarBodyScroll = new PerfectScrollbar('.chat-content .chat-body');
  }

  $('body').on('change input paste','#folder_name',function(){
    var fn=$('#folder_name').val();
    if(fn!=''){
       $('#btn_create_btn').attr('disabled',false); 
    }else{
      $('#btn_create_btn').attr('disabled',true);
    }
  });


  $('#newFolderModal').find('#parent_folder_disk_name').val(parent_folder);


  $('body').on('click','.folder_ellipsed_name',function(){
    $('#newFolderModal').find('#parent_folder_disk_name').val($(this).attr('data-disk_name'));

  $('#back_to_parent').attr('data-back',$(this).attr('data-pfoldder_disk_name'));
  $('#back_to_parent').attr('data-p-back',$(this).attr('data-spfoldder_disk_name'));

    // $('#curent_folder').html($(this).attr('data-fname'));
    // $('#curent_folder_created').html($(this).attr('data-cdate'));
    // $('#newFileModal').find('#folder_data').val($(this).attr('data-folder'));

    // $('#document_folder').val($(this).attr('data-folder'));
    // $('#parent_folder').val($(this).attr('data-folder'));
    // $('#parent_folder_name').val($(this).attr('data-folder'));

    // $('#back_to_parent').attr('data-back',$(this).attr('data-pfoldder'));

    get_folders($(this).attr('data-disk_name'));
    get_files($(this).attr('data-disk_name'));
    $('#file_parent_folder').val($(this).attr('data-disk_name'));
    // get_folders_in();
  });

  $('body').on('click','#back_to_parent',function(){
    var p=$(this).attr('data-back');
    // alert(parent);
    get_folders(p);
    get_files(p);
    $('#file_parent_folder').val(p);
    $('#back_to_parent').attr('data-back',$(this).attr('data-p-back'));
  });


    $('#form_file_browser_upload').validate({
      
      submitHandler:function(d){
        $.ajax({
            type:'POST',
            url:base_url+'/settings/browser/_upload_file',
            data:new FormData($('#form_file_browser_upload')[0]),
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            target: '.preview',
            beforeSend:function(){
              $('#btn_upload_files').html('<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Uploading...</span></div>').attr('disabled',true);
              $('.progress-bar').width('0%');
              $('.progress-bar').attr('aria-valuenow','0');
              // $('.progress-bar').text('0%');
            },
            success:function(f){
              if(f.success){
                  Swal.fire({
                  icon: 'success',
                  title: f.success,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });
                $('.progress-bar').css('width','0%');
                $('.progress-bar').attr('aria-valuenow','0');
              }else if(f.error){
                  Swal.fire({
                  icon: 'error',
                  title: f.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });
              }else if(f.redirect){
                window.location.href=f.redirect;
              }
            },
            xhr: function(){
                //Get XmlHttpRequest object
                 var xhr = $.ajaxSettings.xhr() ;
                //Set onprogress event handler
                 xhr.upload.onprogress = function(data){
                    var perc =(data.loaded / data.total) * 100;// Math.round((data.loaded / data.total) * 100);
                    $('.progress-bar').css('width',perc.toFixed(2) + '%');
                    //.text(perc.toFixed(2) + '%');
                    $('.progress-bar').attr('aria-valuenow',perc.toFixed(2));
                 };
                 return xhr ;
            },
            error: function (e) {
              
                Swal.fire({
                icon: 'error',
                title: 'Error has occurred while uploading the media file.',
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            },
            complete:function(status,xhr){
              $('.progress-bar').css('width', '0%');
              $('.progress-bar').attr('aria-valuenow','0');
              $('#btn_upload_files').html('Upload').attr('disabled',false);
              get_files($('#form_file_browser_upload').find('#file_parent_folder').val());
            },
            resetForm: true 
          });
      }
    });



  $('#form_folder_browser').validate({
    rules:{
      folder_name:{
        required:true,
        alphanumeric: true,
        minlength:3,
        maxlength:128
      }
    },
    messages:{
      folder_name:{
        required:'Enter folder name',
        alphanumeric: "Letters, numbers, and underscores only please",
        minlength: "Folder name should be at least 8 characters",
        maxlength: "Folder name should be maximum 128 characters"
      }
    },
    errorPlacement: function(label, element) {
      label.addClass('mt-2 text-danger');
      label.insertAfter(element);
    },
    highlight: function(element, errorClass) {
      $(element).parent().addClass('has-danger')
      $(element).addClass('form-control-danger')
    },
    submitHandler:function(){
     var folder_name=$('#folder_name').val();
     var parent_folder_disk_name=$('#parent_folder_disk_name').val();

      $.ajax({
        type:'POST',
        url:base_url+'/settings/browser/_create_folder',
        data: {parent_folder_disk_name:parent_folder_disk_name,folder_name:folder_name,csrf_test_name:csrf_hash},
        cache:false,
        beforeSend:function(){
          $('#btn_create_btn').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d,status,xhr){
          if(d.success){
            var html='<div class="alert alert-success alert-dismissible fade show" role="alert">'+d.success+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#newFolderModal').find('div.diverror').html(html);

              get_folders(parent_folder_disk_name);
             
              setTimeout(function(){
                $('#newFolderModal').find('div.diverror').html('');    
                $('#btn_create_btn').html('Create').prop('disabled',false);
                //$('#newFolderModal').find('#form_folder_browser')[0].reset();
                $('#newFolderModal').find('#folder_name').val('');
                $('#newFolderModal').modal('toggle');                
              },1200);              
          }else if(d.error){
            var html='<div class="alert alert-danger alert-dismissible fade show" role="alert">'+d.error+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

            $('#newFolderModal').find('div.diverror').html(html);

            setTimeout(function(){
              $('#newFolderModal').find('div.diverror').html('');    
              $('#btn_create_btn').html('Create').prop('disabled',false);
              $('#newFolderModal').find('#form_browser_folder')[0].reset();               
            },1200); 
          }
        },
        error: function( jqXhr ) {
          //alert(jqXhr)
          if( jqXhr.status == 400 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request url not found',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }else if( jqXhr.status == 403 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request is forbidden',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }

          $('#newFolderModal').find('#form_browser_folder')[0].reset();

          $('#btn_create_btn').html('Create').prop('disabled',false);
        }
      });
    }
  });


  $('#tinyFileBrowserModal').on('shown.bs.modal', function (e) {

    get_folders(parent_folder);
    get_files(parent_folder);
    $('#file_parent_folder').val(parent_folder);

    $('#buttons_wrapper').css('display','none');

    // $.ajax({
    //  type:'POST',
    //  url:base_url+'/settings/browser/_get_folders',
    //  data:{csrf_test_name:csrf_hash,parent_folder:parent_folder},
    //  success:function(d){
    //    $('#sys_folders').html(d.html);
    //  }
    // });
  });

  $('#tinyFileBrowserModal').on('hidden.bs.modal', function () {
      //$('#sys_folders').html('');
      $('#buttons_wrapper').css('display','block');
      localStorage.setItem('banner_img','0');
  });

    tiny_mce();

    $(document).on('click','#btn_add_heading',function(){
        var heading_rows='';

          heading_rows+='<tr id="trNews' + hdr + '">';
      heading_rows+='<td>';
        heading_rows+='<div class="form-group row">';
          heading_rows+='<div class="col-md-12">';
                  heading_rows+='<label for="system_meta_title">News Detail</label>';
                  heading_rows+='<input type="hidden" name="news_details['+ hdr +'][data_type]" value="general">';
                  heading_rows+='<textarea class="form-control news_details" rows="40" name="news_details['+ hdr +'][news_content]"></textarea>';
                heading_rows+='</div>';
            heading_rows+='</div>';
        heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull0right" onclick="$(\'#trNews' + hdr + '\').remove()">Delete Row</button></div></div>';
      heading_rows+='</td>';
      heading_rows+='</tr>';

        $('#heading_rows tbody').append(heading_rows);

        tiny_mce();

        hdr++;
    });

    localStorage.setItem('banner_img','0');

    $('body').on('click','#btn_news_banner_image_url',function(){
      localStorage.setItem('banner_img','1');
    });


    $(document).on('click','.img-fluid',function(){
      var dataimg=$(this).attr('data-img');
      var datafile_id=$(this).attr('data-file_id');
      //alert();
      if(localStorage.getItem('banner_img')=='0'){
        
        var heading_rows='';

        heading_rows+='<tr id="trNews' + hdr + '">';
        heading_rows+='<td>';
        heading_rows+='<div class="form-group row">';
        heading_rows+='<div class="col-md-12">';
        heading_rows+='<label>Image Data</label>';
        heading_rows+='<input type="hidden" name="news_details['+hdr+'][data_type]" value="image">';
        heading_rows+='<input type="hidden" name="news_details['+hdr+'][data_type_value]" value="'+datafile_id+'">';
        heading_rows+='<input type="hidden" name="news_details['+hdr+'][news_content]" value="'+dataimg+'">';
        heading_rows+='<div class="row"><img src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
        heading_rows+='<div>';
        heading_rows+='</div>';
        heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull0right" onclick="$(\'#trNews' + hdr + '\').remove()">Delete Row</button></div></div>';
        heading_rows+='</td>';
        heading_rows+='<tr>';

        $('#heading_rows tbody').append(heading_rows);

        $('#tinyFileBrowserModal').modal('hide');

        hdr++;
      }else if(localStorage.getItem('banner_img')=='1'){
        $('#news_banner_image_url').val(dataimg);
        $('#news_banner_image_id').val(datafile_id);
        $('#tinyFileBrowserModal').modal('hide');
      }
        

    });

    function tiny_mce(){
      tinymce.init({
          selector: '.news_details',
          entity_encoding : "raw",
          height: 400,
          theme: 'silver',
          plugins: [
            'code fullscreen table colorpicker visualblocks link',
          ],
          menubar: 'table view',
          toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link undo redo | image code | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
          toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help | visualblocks | visualchars | link',
          link_context_toolbar: true,
          link_class_list: [
            {title: 'None', value: ''},
            {title: 'External Link', value: 'ext_link'},
            {title: 'Internal Support Link', value: 'int_sup_link'},
            {title: 'Internal Marketing Link', value: 'int_mark_link'},
            {title: 'Other Internal Link', value: 'int_other_link'}
          ],
          visualblocks_default_state: true,
          target_list: false,
          image_advtab: true,
          templates: [{
              title: 'Test template 1',
              content: 'Test 1'
            },
            {
              title: 'Test template 2',
              content: 'Test 2'
            }
          ],
          content_css: []
        });
    }


    

  function get_folders(parent_folder){
    $.ajax({
      type:'POST',
      url:base_url+'/settings/browser/_get_folders',
      data:{csrf_test_name:csrf_hash,parent_folder:parent_folder},
      success:function(d){
        $('#sys_folders').html(d.html);
      }
    });
  }

  function get_files(parent_folder){
    $.ajax({
      type:'POST',
      url:base_url+'/settings/browser/_get_files',
      data:{csrf_test_name:csrf_hash,parent_folder:parent_folder},
      success:function(d){
        $('#sys_files').html(d.html);
      }
    });
  }


  $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });

  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  });

});