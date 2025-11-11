function set_yt_video(_hdr){
  var url=$('#ytVid'+_hdr).val();
  console.log(url);
  $('#trYoutubeFrame'+_hdr).attr('src',url);
  $('#trYoutubeFrameDiv'+_hdr).css('display','block');
  
}

jQuery(function($) {
  'use strict';

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");


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

  //Upload Files

  $('#fileUploadModal').on('hidden.bs.modal', function () {
    $('#buttons_wrapper').css('display','block');
    window.location.reload();
  });

  $('#fileUploadModal').on('shown.bs.modal', function (e) {

    $('#file_upload_parent_folder').val(parent_folder);
    $('#file_type_id').val(exam_id);

    $('#buttons_wrapper').css('display','none');
  });


  $('#form_file_upload').validate({
    rules:{
      file_upload_type:{
        valueNotEquals:'0'
      },
      file_upload_type_name:{
        required:true,
        minlength:10
      }
    },
    messages:{
      file_upload_type:{
        valueNotEquals:'Select file type'
      },
      file_upload_type_name:{
        required:'Enter file name'
      }
    },    
    submitHandler:function(d){
      $.ajax({
        type:'POST',
        url:base_url+'/settings/browser/_upload_other_file',
        data:new FormData($('#form_file_upload')[0]),
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        target: '.preview',
        beforeSend:function(){
          $('#btn_upload_other_files').html('<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Uploading...</span></div>').attr('disabled',true);
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
          $('#btn_upload_other_files').html('Upload').attr('disabled',false);
          //get_files($('#form_file_browser_upload').find('#file_parent_folder').val());
        },
        resetForm: true 
      });
    }
  });


  var efr=parseInt(exam_prep_faq_row)+1;

  $(document).on('click','#btn_add_exam_prep_faqus_row',function(){
    var html='';

    html+='<tr id="tr' + efr + '">';
    html+='<td>';
    html+='<div class="row">';
    html+='<input type="text" class="form-control" name="exam_prep_faqus['+efr+'][ques]" aria-describedby="exam_prep_faqus" placeholder="Question" value="">';
    html+='</div>';
    html+='<div class="row">';
    html+='<textarea class="form-control exam_prep_info" name="exam_prep_faqus['+efr+'][ans]" aria-describedby="exam_prep_faqus" placeholder="Answer" rows="5" style="width:100%;"></textarea>';
    html+='</div>';
    html+='</td>';
    html+='<td>';
    html+='<button type="button" class="btn btn-sm btn-danger" onclick="$(\'#tr' + efr + '\').remove()"><i class="fa fa-minus"></i></button>';
    html+='</td>';
    html+='</tr>';

    $('#form_exam_prep_faqus_table tbody').append(html);

    exam_prep_faq_area();

    efr++;
  });

  exam_prep_faq_area();

  function exam_prep_faq_area(){
    tinymce.init({
      selector: '.exam_prep_info',
      entity_encoding : "raw",
      height: 400,
      theme: 'silver',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen table',
      ],
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
      toolbar2: 'forecolor backcolor emoticons | codesample',
      table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
      table_appearance_options: true,
      table_use_colgroups: true,
      link_quicklink: true,
      default_link_target: '_blank',
      link_context_toolbar: true,
      link_default_protocol: 'https',
      link_class_list: [
        {title: 'None', value: ''},
        {title: 'External Link', value: 'ext_link'},
        {title: 'Internal Links',
          menu: [
            {title: 'Internal Support Link', value: 'int_sup_link'},
            {title: 'Internal Marketing Link', value: 'int_mark_link'},
            {title: 'Other Internal Link', value: 'int_other_link'}
          ]
        }
      ],
      link_list: [
        {title: 'Connect to Exam Quick Links',
          menu: exam_menues
        },
        {title: 'Connect to Exam News',
          menu: exam_news
        },
        {
          title:'Connect to Question Paper',
          menu:exam_page_question_paper
        },
        {
          title:'Connect to Answer Paper',
          menu:exam_page_answer_paper
        },
        {
          title:'Connect to Speaking Practice Paper',
          menu:exam_page_speaking_test_paper
        },
        {
          title:'Connect to Writing Practice Paper',
          menu:exam_page_writing_practice_paper
        },
        {
          title:'Connect to Listening Practice Paper',
          menu:exam_page_listening_practice_paper
        },
        {
          title:'Connect to Sample Practice Paper',
          menu:exam_page_sample_practice_paper
        },
        {title: 'Connect to Exam Syllabus PDF Links',
          menu: exam_page_syllabus_pdfs
        },
      ],
      target_list: [
        {title: 'None', value: ''},
        {title: 'Same page', value: '_self'},
        {title: 'New page', value: '_blank'},
        {title: 'Parent frame', value: '_parent'}
      ],
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

  $('#tinyFileBrowserModal').on('hidden.bs.modal', function () {
    $('#buttons_wrapper').css('display','block');
  });

  $('#tinyFileBrowserModal').on('shown.bs.modal', function (e) {

    get_folders(parent_folder);
    get_files(parent_folder);
    $('#file_parent_folder').val(parent_folder);

    $('#buttons_wrapper').css('display','none');
  });


  $(document).on('click','.img-fluid',function(){
    var dataimg=$(this).attr('data-img');
    var datafile_id=$(this).attr('data-file_id');
    var heading_rows='';

    heading_rows+='<tr id="trExamPrepDetails' + phdr + '">';
    heading_rows+='<td>';
    heading_rows+='<div class="form-group row">';
    heading_rows+='<div class="col-md-12">';
    heading_rows+='<h6>Image Data</h6>';
    heading_rows+='<input type="hidden" name="prep_details['+phdr+'][data_type]" value="image">';
    heading_rows+='<input type="hidden" name="prep_details['+phdr+'][data_type_value]" value="'+datafile_id+'">';
    heading_rows+='<input type="hidden" name="prep_details['+phdr+'][prep_content]" value="'+dataimg+'">';
    heading_rows+='<div class="row"><img src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
    heading_rows+='<div>';
    heading_rows+='</div>';
    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trExamPrepDetails' + phdr + '\').remove()">Delete Row</button></div></div>';
    heading_rows+='</td>';
    heading_rows+='<tr>';

    $('#heading_rows tbody').append(heading_rows);

    $('#tinyFileBrowserModal').modal('hide');

    hdr++;
  });

  $(document).on('click','#btn_add_heading',function(){
    var heading_rows='';

    heading_rows+='<tr id="trExamPrepDetails' + phdr + '">';
    heading_rows+='<td>';
    heading_rows+='<div class="form-group row">';
      heading_rows+='<div class="col-md-12">';
              heading_rows+='<h6>Preparation Guide Detail</h6>';
              heading_rows+='<input type="hidden" name="prep_details['+ phdr +'][data_type]" value="general">';
              heading_rows+='<textarea class="form-control prep_details" rows="40" name="prep_details['+ phdr +'][prep_content]"></textarea>';
            heading_rows+='</div>';
        heading_rows+='</div>';
    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trExamPrepDetails' + phdr + '\').remove()">Delete Row</button></div></div>';
    heading_rows+='</td>';
    heading_rows+='</tr>';

    $('#heading_rows tbody').append(heading_rows);

    tiny_mce();

    phdr++;
  });

  $(document).on('click','#btn_add_youtube_video',function(){
    var heading_rows='';

    heading_rows+='<tr id="trYoutube' + phdr + '">';
    heading_rows+='<td>';
    heading_rows+='<div class="form-group row">';
      heading_rows+='<div class="col-md-12">';
              heading_rows+='<h6>Youtube Video</h6>';
              heading_rows+='<input type="hidden" name="prep_details['+ phdr +'][data_type]" value="youtube_video">';
              heading_rows+='<input type="text" id="ytVid'+ phdr +'" class="form-control" name="prep_details['+ phdr +'][prep_content]" value="" placeholder="Youtube URL" onpaste="set_yt_video('+ phdr +')" onkeyup="set_yt_video('+ phdr +')" onkeypress="set_yt_video('+ phdr +')">';
            heading_rows+='</div>';
        heading_rows+='</div>';

          heading_rows+='<div class="col-md-12" id="trYoutubeFrameDiv' + phdr + '" style="display:none;">';
              heading_rows+='<div class="embed-responsive embed-responsive-16by9">';
                heading_rows+='<iframe id="trYoutubeFrame' + phdr + '" class="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" allowfullscreen></iframe>';
              heading_rows+='</div>';
            heading_rows+='</div>';
        heading_rows+='</div>';


    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trYoutube' + phdr + '\').remove()">Delete Row</button></div></div>';
    heading_rows+='</td>';
    heading_rows+='</tr>';

    $('#heading_rows tbody').append(heading_rows);

    phdr++;
  });

  $(document).on('click','.div_block',function(){
    var d=$(this).html();
    var datafile_id=$(this).attr('data-aid');
    var heading_rows='';

    heading_rows+='<tr id="trExamPrepDetails' + phdr + '">';
    heading_rows+='<td>';
    heading_rows+='<div class="form-group row">';
      heading_rows+='<div class="col-md-12">';
              heading_rows+='<h6>Exam Detail</h6>';
              heading_rows+='<input type="hidden" name="prep_details['+ phdr +'][data_type]" value="ads">';
              heading_rows+='<input type="hidden" name="prep_details['+phdr+'][data_type_value]" value="'+datafile_id+'">';
              heading_rows+='<textarea class="form-control" rows="40" name="prep_details['+ phdr +'][prep_content]" style="display:none;">'+d+'</textarea>';
              heading_rows+='<div class="col-md-12">'+d+'</div>';
            heading_rows+='</div>';
        heading_rows+='</div>';
    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trExamPrepDetails' + phdr + '\').remove()">Delete Row</button></div></div>';
    heading_rows+='</td>';
    heading_rows+='</tr>';

    $('#heading_rows tbody').append(heading_rows);

    tiny_mce();

    $('#adsModal').modal('hide');

    hdr++;
  });


  if ($(".prep_details").length) {
    tiny_mce();
  }

  function tiny_mce(){
    tinymce.init({
      selector: '.prep_details',
      entity_encoding : "raw",
      height: 400,
      theme: 'silver',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen table',
      ],
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
      toolbar2: 'forecolor backcolor emoticons | codesample',
      table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
      table_appearance_options: true,
      table_use_colgroups: true,
      link_quicklink: true,
      default_link_target: '_blank',
      link_context_toolbar: true,
      link_default_protocol: 'https',
      link_class_list: [
        {title: 'None', value: ''},
        {title: 'External Link', value: 'ext_link'},
        {title: 'Internal Links',
          menu: [
            {title: 'Internal Support Link', value: 'int_sup_link'},
            {title: 'Internal Marketing Link', value: 'int_mark_link'},
            {title: 'Other Internal Link', value: 'int_other_link'}
          ]
        }
      ],
      link_list: [
        {title: ' Fees Structure', value: '/course-fees'},
        {title: 'Connect to Exam',
          menu: [
            {title: 'Internal Support Link', value: 'int_sup_link'},
            {title: 'Internal Marketing Link', value: 'int_mark_link'},
            {title: 'Other Internal Link', value: 'int_other_link'}
          ]
        }
      ],
      target_list: [
        {title: 'None', value: ''},
        {title: 'Same page', value: '_self'},
        {title: 'New page', value: '_blank'},
        {title: 'Parent frame', value: '_parent'}
      ],
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


   $('#form_exams_prep_details_data_add_edit').validate({
    submitHandler:function(){
      tinyMCE.triggerSave(true, true);
      $.ajax({
        type:'POST',
        url:base_url+'/streams/exams/preparation_guide_data_details_add',
        data:$('#form_exams_prep_details_data_add_edit').serialize(),
        beforeSend:function(){
          $('#btn_save_exam_prep_details').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(f){
          if(f.success){
           $('#btn_save_exam_prep_details').html('Save').prop('disabled',false);
           Swal.fire({
              icon: 'success',
              title: f.success,
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });

            //window.location.reload();           
          }else if(f.error){
            $('#btn_save_exam_prep_details').prop('disabled',false);
            Swal.fire({
              icon: 'error',
              title: f.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });
          }else if(f.redirect){
            $('#btn_save_exam_prep_details').prop('disabled',false);
            Swal.fire({
              icon: 'info',
              title: 'Your session expired',
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });
          }
        }
      });
    }
  });

  $('#adsModal').on('shown.bs.modal', function (e) {
      $('#buttons_wrapper').css('display','none');
      load_ads();
  });

  $('#adsModal').on('hidden.bs.modal', function (e) {
    $('#buttons_wrapper').css('display','block');
  });

  function load_ads(){
    $('#ads_list_table').DataTable({ 
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
          "url": base_url+'/ads/search_import',
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