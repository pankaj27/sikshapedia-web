jQuery(function($) {
  'use strict';

  tiny_mce('.page_content');

  // The DOM element you wish to replace with Tagify
  var input = document.querySelector('input[name=page_meta_keywords]');

  // initialize Tagify on the above input node reference
  new Tagify(input)

    $('#form_course_streams_page_meta').validate({
      rules:{
        page_heading:{
          required:true,
          maxlength:200
        },
        page_sub_heading:{
          maxlength:200
        },
        page_meta_title:{
          required:true,
          maxlength:200
        },
        page_meta_keywords:{
          required:true
        },
        page_meta_desc:{
          required:true
        },
        page_og_title:{
          required:true,
          maxlength:200
        },
        page_og_desc:{
          required:true
        },
        page_twitter_title:{
          required:true
        },
        page_twitter_desc:{
          required:true
        },
        page_search_heading:{
          maxlength:180
        }
      },
      messages:{
        page_heading:{
          required:'Enter page heading'
        },
        page_meta_title:{
          required:'Enter page meta title',
        },
        page_meta_keywords:{
          required:'Enter keywords'
        },
        page_meta_desc:{
          required:'Enter page meta description'
        },
        page_og_title:{
          required:'Enter OG title'
        },
        page_og_desc:{
          required:'Enter OG description'
        },
        page_twitter_title:{
          required:'Enter Twitter title'
        },
        page_twitter_desc:{
          required:'Enter Twitter description'
        }
      },
      submitHandler:function(){

        var formData=new FormData($('#form_course_streams_page_meta')[0]);
        formData.append([csrf_name],csrf_hash);

        $.ajax({
          type:'POST',
          url:base_url+'/seo/update_course_category_stream_page',
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_course_stream_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(d,status,xhr){
            if(d.success){
              Swal.fire({
                  icon: 'success',
                  title: d.success,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#d33',
                  allowOutsideClick: false,
                });
            }else if(d.error){
              Swal.fire({
                  icon: 'error',
                  title: d.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#d33',
                  allowOutsideClick: false,
                });
            }
          },
          error: function( jqXhr ) {
            console.log(jqXhr);
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

 
            $('#btn_update_course_stream_meta').html('Update').prop('disabled',false);
          },
          complete:function(status,xhr){

            $('#btn_update_course_stream_meta').html('Update').prop('disabled',false);
          }
        });
      }
    });

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

    function tiny_mce_v2(tiny_mce_class){
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


});