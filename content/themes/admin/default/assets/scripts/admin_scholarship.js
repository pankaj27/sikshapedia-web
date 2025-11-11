jQuery(function($) {
  'use strict';

  if ($(".scholarship_details").length) {
    tinymce.init({
      selector: '.scholarship_details',
      entity_encoding : "raw",
      height: 400,
      theme: 'silver',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
      ],
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
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

  $(document).on('click','#btn_add_heading',function(){
        var heading_rows='';

          heading_rows+='<tr id="trNews' + bposthdr + '">';
      heading_rows+='<td>';
        heading_rows+='<div class="form-group row">';
          heading_rows+='<div class="col-md-12">';
                  heading_rows+='<label for="scholarship_details'+ bposthdr +'">Scholarship Detail</label>';
                  heading_rows+='<input type="hidden" id="scholarship_details'+ bposthdr +'" name="scholarship_details['+ bposthdr +'][data_type]" value="general">';
                  heading_rows+='<textarea class="form-control scholarship_details" rows="40" name="scholarship_details['+ bposthdr +'][scholarship_content]"></textarea>';
                heading_rows+='</div>';
            heading_rows+='</div>';
        heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trNews' + bposthdr + '\').remove()">Delete Row</button></div></div>';
      heading_rows+='</td>';
      heading_rows+='</tr>';

        $('#heading_rows tbody').append(heading_rows);

        tiny_mce();

        bposthdr++;
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

  $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });

  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
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

    $('#form_scholarship_add_edit').validate({
    submitHandler:function(){
      $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/scholarships_add',
          data:new FormData($('#form_scholarship_add_edit')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_scholarship_news').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_scholarship_news').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });            
            }else if(f.error){
              $('#btn_scholarship_news').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_scholarship_news').prop('disabled',true);
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
            $('#btn_scholarship_news').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });

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

  function tiny_mce(){
      tinymce.init({
          selector: '.scholarship_details',
          entity_encoding : "raw",
          height: 400,
          theme: 'silver',
          plugins: [
            'code fullscreen table colorpicker visualblocks',
          ],
          menubar: 'table view',
          toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link undo redo | image code | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
          toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help | visualblocks | visualchars',
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

});