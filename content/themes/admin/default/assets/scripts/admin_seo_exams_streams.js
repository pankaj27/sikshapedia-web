jQuery(function($) {
  'use strict';

  tiny_mce('.page_content');

  function tiny_mce(tiny_mce_class){
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

  // The DOM element you wish to replace with Tagify
  var input = document.querySelector('input[name=page_meta_keywords]');

  // initialize Tagify on the above input node reference
  new Tagify(input)


  $('#form_exam_streams_page_meta').validate({
      rules:{
        page_heading:{
          required:true
        },
        page_meta_title:{
          required:true,
        },
        page_meta_keywords:{
          required:true
        },
        page_meta_desc:{
          required:true
        },
        page_og_title:{
          required:true,
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

        var formData=new FormData($('#form_exam_streams_page_meta')[0]);
        formData.append([csrf_name],csrf_hash);

        $.ajax({
          type:'POST',
          url:base_url+'/seo/exams/streamsmetaupdate',
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_exam_stream_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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

 
            $('#btn_update_exam_stream_meta').html('Update').prop('disabled',false);
          },
          complete:function(status,xhr){

            $('#btn_update_exam_stream_meta').html('Update').prop('disabled',false);
          }
        });
      }
    });


});