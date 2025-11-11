jQuery(function($) {
  'use strict';

    tiny_mce('.page_faqs');
    tiny_mce('.page_details');

    $(document).on('click','#btn_add_faqs',function(){

      var faqs_rows='';

      faqs_rows+='<tr id="trPageDetails'+detail_faq_row+'">';
      faqs_rows+='<td>';
            faqs_rows+='<textarea class="form-control" name="page_faqs['+detail_faq_row+'][ques]" aria-describedby="page_faqs" placeholder="Question" rows="5"></textarea>';
          faqs_rows+='</td>';
          faqs_rows+='<td>';
            faqs_rows+='<textarea class="form-control page_faqs" name="page_faqs['+detail_faq_row+'][ans]" aria-describedby="page_faqs" placeholder="Answer" rows="5"></textarea><hr><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trPageDetails' + detail_faq_row + '\').remove()" style="float:right;">Delete Row</button><button type="button" class="btn btn-xs btn-primary" id="btn_add_faqs" style="float: right;"><i class="fa fa-plus"></i></button>';
          faqs_rows+='</td>';
      faqs_rows+='</tr>';

      $('#page_faqs_rows_table').append(faqs_rows);


      tiny_mce('.page_faqs');

      detail_faq_row++;

    });


    $(document).on('click','#btn_add_heading',function(){
        var heading_rows='';

        heading_rows+='<tr id="tr2' + hdr + '">';
        heading_rows+='<td>';
          heading_rows+='<div class="form-group row">';
            heading_rows+='<div class="col-md-12">';
              heading_rows+='<label for="system_meta_title"><strong>Page Details</strong></label>';
              heading_rows+='<input type="hidden" name="page_details['+hdr+'][data_type]" value="general"><textarea class="form-control page_details" rows="40" name="page_details['+hdr+'][heading_detail]"></textarea>';
            heading_rows+='</div>';
          heading_rows+='</div>';
          heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#tr2' + hdr + '\').remove()">Delete Row</button></div></div>';
        heading_rows+='</td>';
        heading_rows+='</tr>';

        $('#heading_rows tbody').append(heading_rows);

        tiny_mce('.page_details');

        hdr++;
    });

    $(document).on('click','.img-fluid',function(){
      var dataimg=$(this).attr('data-img');
      var datafile_id=$(this).attr('data-file_id');
      var heading_rows='';

      heading_rows+='<tr id="tr3' + hdr + '">';
      heading_rows+='<td>';
      heading_rows+='<div class="form-group row">';
      heading_rows+='<div class="col-md-12">';
      heading_rows+='<label>Image Data</label>';
      heading_rows+='<input type="hidden" name="page_details['+hdr+'][data_type]" value="image">';
      heading_rows+='<input type="hidden" name="page_details['+hdr+'][data_type_value]" value="'+datafile_id+'">';
      heading_rows+='<input type="hidden" name="page_details['+hdr+'][heading_detail]" value="'+dataimg+'">';
      heading_rows+='<div class="row"><img src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
      heading_rows+='<div>';
      heading_rows+='</div>';
      heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull0right" onclick="$(\'#tr3' + hdr + '\').remove()">Delete Row</button></div></div>';
      heading_rows+='</td>';
      heading_rows+='<tr>';

      //console.log(heading_rows);

      $('#heading_rows tbody').append(heading_rows);

      $('#tinyFileBrowserModal').modal('hide');

      hdr++;

    });


    $('#adsModal').on('shown.bs.modal', function (e) {
      $('#buttons_wrapper').css('display','none');
      load_ads();
    });

    $('#adsModal').on('hidden.bs.modal', function (e) {
      $('#buttons_wrapper').css('display','block');
    });

    $(document).on('click','.div_block',function(){
      var d=$(this).html();
      var datafile_id=$(this).attr('data-aid');
      var heading_rows='';

      heading_rows+='<tr id="trStreamDetails' + hdr + '">';
      heading_rows+='<td>';
      heading_rows+='<div class="form-group row">';
        heading_rows+='<div class="col-md-12">';
                heading_rows+='<h6>Stream Detail</h6>';
                heading_rows+='<input type="hidden" name="page_details['+ hdr +'][data_type]" value="ads">';
                heading_rows+='<input type="hidden" name="page_details['+hdr+'][data_type_value]" value="'+datafile_id+'">';
                heading_rows+='<textarea class="form-control" rows="40" name="page_details['+ hdr +'][heading_detail]" style="display:none;">'+d+'</textarea>';
                heading_rows+='<div class="col-md-12">'+d+'</div>';
              heading_rows+='</div>';
          heading_rows+='</div>';
      heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trStreamDetails' + hdr + '\').remove()">Delete Row</button></div></div>';
      heading_rows+='</td>';
      heading_rows+='</tr>';

      $('#heading_rows tbody').append(heading_rows);

      tiny_mce();

      $('#adsModal').modal('hide');

      hdr++;
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

    $('#tinyFileBrowserModal').on('shown.bs.modal', function (e) {

      get_folders(parent_folder);
      get_files(parent_folder);
      $('#file_parent_folder').val(parent_folder);

      $('#buttons_wrapper').css('display','none');
    });

    $('#tinyFileBrowserModal').on('hidden.bs.modal', function () {
        //$('#sys_folders').html('');
        $('#buttons_wrapper').css('display','block');
    });



  $('#form_college_url_detail_data_edit').validate({
    submitHandler:function(){
      $.ajax({
        type:'POST',
        url:base_url+'/seo/searches_colleges_details_add',
        data:$('#form_college_url_detail_data_edit').serialize(),
        success:function(d){
          if(d.success){
            alert(d.success);
          }else{
            alert(d.error);
          }
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



  function tiny_mce_old(tiny_mce_class){
    tinymce.init({
      selector: tiny_mce_class,
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
        {title: 'Connect to Exams',
          menu: ''
        },
        {title: 'Connect to Exam Menues',
          menu: ''
        },
        {title: 'Connect to Exam News',
          menu: ''
        },
        {
          title:'Connect to Colleges',
          menu: ''
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

  function tiny_mce(ctrl_area){
  tinymce.init({
    selector: ctrl_area,
    license_key: 'gpl',
    entity_encoding : "raw",
    height: 400,
    theme: 'silver',
    browser_spellcheck: true,
    font_family_formats:"UbuntuCondensed-Regular;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
    font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
      formats: {
      alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'left' },
      aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'center' },
      alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'right' },
      alignfull: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'full' },
      bold: { inline: 'span', classes: 'bold' },
      italic: { inline: 'span', classes: 'italic' },
      underline: { inline: 'span', classes: 'underline', exact: true },
      strikethrough: { inline: 'del' },
      customformat: { inline: 'span', styles: { color: '#00ff00', fontSize: '20px' }, attributes: { title: 'My custom format'} , classes: 'example1'}
    },
    style_formats: [
      { title: 'Custom format', format: 'customformat' },
      { title: 'Align left', format: 'alignleft' },
      { title: 'Align center', format: 'aligncenter' },
      { title: 'Align right', format: 'alignright' },
      { title: 'Align full', format: 'alignfull' },
      { title: 'Bold text', inline: 'strong' },
      { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
      { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
      { title: 'Badge', inline: 'span', styles: { display: 'inline-block', border: '1px solid #2276d2', 'border-radius': '5px', padding: '2px 5px', margin: '0 2px', color: '#2276d2' } },
      { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' },
      { title: 'Image formats' },
      { title: 'Image Left', selector: 'img', styles: { 'float': 'left', 'margin': '0 10px 0 10px' } },
      { title: 'Image Right', selector: 'img', styles: { 'float': 'right', 'margin': '0 0 10px 10px' } },
    ],
    toolbar: 'undo redo paste | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | customToc | removeformat',
    paste_as_text: true,
    images_file_types: 'png,jpeg,jpg,svg,webp',
    setup: function(editor) {
      editor.ui.registry.addButton('customToc', {
        text: 'Insert TOC',
        onAction: function () {
            const headings = editor.dom.select('h1, h2, h3, h4, h5, h6');
            let tocHtml = '<div class="custom-toc" id="dynamic-toc"><h3>Table of Contents</h3><ul>';

            if (headings.length) {
                headings.forEach(heading => {
                const text = heading.innerText || heading.textContent || 'Untitled';
                let id = editor.dom.getAttrib(heading, 'id');

                if (!id) {
                    // Generate unique ID from text
                    id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                    let uniqueId = id;
                    let counter = 1;

                    // Ensure ID is unique
                    while (editor.dom.get(id)) {
                    uniqueId = `${id}-${counter++}`;
                    }

                    id = uniqueId;
                    editor.dom.setAttrib(heading, 'id', id);
                }

                const level = parseInt(heading.nodeName.substring(1));
                tocHtml += `<li class="toc-level-${level}"><a href="#${id}" class="toc-link">${text}</a></li>`;
                });
            } else {
                tocHtml += '<li><em>No headings found. Add headings (H1-H6) to populate this table of contents.</em></li>';
            }

            tocHtml += '</ul></div>';

            editor.insertContent(tocHtml);
        }

      });

      editor.on('init', function () {
        tinyMceEditLinkSearch(editor); // your existing custom link handler for regular links
      });

      editor.on('change', function () {
        editor.save();
      });
    }
  });
}


  function tiny_mce_v2(ctrl_area){
    tinymce.init({
      selector: ctrl_area,
      license_key: 'gpl',
      entity_encoding : "raw",
      height: 400,
      theme: 'silver',
      browser_spellcheck: true,
      font_family_formats:"UbuntuCondensed-Regular;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
      font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
      formats: {
        alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'left' },
        aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'center' },
        alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'right' },
        alignfull: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'full' },
        bold: { inline: 'span', classes: 'bold' },
        italic: { inline: 'span', classes: 'italic' },
        underline: { inline: 'span', classes: 'underline', exact: true },
        strikethrough: { inline: 'del' },
        customformat: { inline: 'span', styles: { color: '#00ff00', fontSize: '20px' }, attributes: { title: 'My custom format'} , classes: 'example1'}
      },
      style_formats: [
        { title: 'Custom format', format: 'customformat' },
        { title: 'Align left', format: 'alignleft' },
        { title: 'Align center', format: 'aligncenter' },
        { title: 'Align right', format: 'alignright' },
        { title: 'Align full', format: 'alignfull' },
        { title: 'Bold text', inline: 'strong' },
        { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
        { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
        { title: 'Badge', inline: 'span', styles: { display: 'inline-block', border: '1px solid #2276d2', 'border-radius': '5px', padding: '2px 5px', margin: '0 2px', color: '#2276d2' } },
        { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' },
        { title: 'Image formats' },
        { title: 'Image Left', selector: 'img', styles: { 'float': 'left', 'margin': '0 10px 0 10px' } },
        { title: 'Image Right', selector: 'img', styles: { 'float': 'right', 'margin': '0 0 10px 10px' } },
      ],
      toolbar: 'undo redo paste | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
      table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
      paste_as_text: true,
      images_file_types: 'png,jpeg,jpg,svg,webp',
      setup: function(editor) {
        // Register our custom button callback function
        editor.on('init',function(e) {
            //tinyMceEditLink(editor);
            tinyMceEditLinkSearch(editor);
        });

        editor.on('change', function () {
          editor.save();
        });

      },
      table_appearance_options: true,
      table_use_colgroups: true
    });
}

function tinyMceEditLinkSearch(editor){
  editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
    editor.windowManager.open = function (t, r) {    // replace with our own function
        var modal = this.oldOpen.apply(this, [t, r]);  // call original
        var h='';
        h+='<select class="form-control" id="search_form">';
        h+='<optgroup label="Exams">';
        h+='<option value="exam">Search from exams</option>';
        h+='</optgroup>';
        h+='<optgroup label="Colleges & Universities">';
        h+='<option value="college">Search from college</option>';
        h+='<option value="universities">Search from universities</option>';
        h+='</optgroup>';
        h+='<optgroup label="Streams & Courses">';
        h+='<option value="streams">Search from streams</option>';
        h+='<option value="courses">Search from course</option>';
        h+='</optgroup>';
        h+='</select>'

        if (t.title === "Insert/Edit Link") {
            $('.tox-form').prepend('<div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false">'+h+'<div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div><div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false"><input type="text" role="combobox" aria-autocomplete="list" aria-haspopup="true" tabindex="-1" class="tox-textfield jAuto" aria-expanded="false" id="search-box"><div id="suggesstion-box"><ul id="search_tag-list"></ul></div><div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div>'
            );

            $('.tox-dialog__footer-end').prepend(
                '<button title="Custom button" type="button" data-alloy-tabstop="true" tabindex="-1" class="tox-button" id="custom_button">Search</button>'
            );
        }else if(t.title === "Insert/Edit Image"){
          
        }

        return modal; // Template plugin is dependent on this return value
    };
}

 $('body').on('click','#custom_button',function(){
    var search_tag=$('input#search-box').val();
    var search_from=$('#search_form :selected').val();
    load_search_link_list(search_tag,search_from);
  });

  $('body').on('click','.search_list_val',function(){
    var selected_url=$(this).data('link_list');

    console.log(selected_url);

    $('input[type=url]').val(selected_url);
    $("#suggesstion-box").hide();
  });


  function load_search_link_list(search_tag,search_from){
    var link_html='';

    $.ajax({
          type: "GET",
          url: base_url+'/link_list_exmas',
          data: 'search_from='+search_from+'&search_tag=' + search_tag,
          dataType: "json",
          beforeSend: function() {
              $("#search-box").css("background", "#FFF url("+loader_icon+") no-repeat 165px");
          },
          success: function(d) {
             if(d.link_list!=''){
              var dd=JSON.parse(d.link_list);
              $.each(dd,function(i,v){
                link_html+='<li class="search_list_val" data-link_list="'+v.value+'">'+v.title+'</li>';
              });
             }
              $("#suggesstion-box").show();
              $("#search_tag-list").html(link_html);
              $("#search-box").css("background", "#FFF");
          }
      });
  }


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
        data:{[csrf_name]:csrf_hash,parent_folder:parent_folder},
        success:function(d){
          $('#sys_folders').html(d.html);
        }
      });
    }

    function get_files(parent_folder){
      $.ajax({
        type:'POST',
        url:base_url+'/settings/browser/_get_files',
        data:{[csrf_name]:csrf_hash,parent_folder:parent_folder},
        success:function(d){
          $('#sys_files').html(d.html);
        }
      });
    }




});