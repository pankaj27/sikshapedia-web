jQuery(function($) {
  'use strict';
  // The DOM element you wish to replace with Tagify
      var input = document.getElementById('blog_post_meta_keywords');

  // initialize Tagify on the above input node reference
  new Tagify(input);

  // if ($('#editor').length > 0) {
  //     var editor = ace.edit("editor");
  //     editor.setTheme("ace/theme/textmate");
  //     editor.session.setMode("ace/mode/json");  
  // }

  

  $("#blog_post_other_category").chosen({no_results_text: "Select Category"});

  // The DOM element you wish to replace with Tagify
  var input = document.querySelector('input[name=blog_post_meta_keywords]');

  // initialize Tagify on the above input node reference
  new Tagify(input);

  //Countries
  $('#blog_posts_list_table').DataTable({ 
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
          "url": base_url+'/blogs_search',
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


  if($(".blog_post_details").length>0) {
    tiny_mce('.blog_post_details');
    //jodit('.blog_post_details');
  }


  jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w. ]+$/i.test(value);
  }, "Letters, numbers,blank space and underscores only please");

  // Applying perfect-scrollbar 
  if ($('.chat-aside .tab-content').length) {
    const sidebarBodyScroll = new PerfectScrollbar('.chat-aside .tab-content');
  }
  if ($('.chat-content .chat-body').length) {
    const sidebarBodyScroll = new PerfectScrollbar('.chat-content .chat-body');
  }


  $(document).on('click','#btn_add_heading',function(){
    var heading_rows='';

    heading_rows+='<tr id="trBlogPost' + bposthdr + '">';
    heading_rows+='<td>';
    heading_rows+='<div class="form-group row">';
      heading_rows+='<div class="col-md-12">';
              heading_rows+='<h6>Content Detail</h6>';
              heading_rows+='<input type="hidden" name="blog_post_details['+ bposthdr +'][data_type]" value="general">';
              heading_rows+='<textarea class="form-control blog_post_details" rows="40" name="blog_post_details['+ bposthdr +'][post_content]"></textarea>';
              heading_rows+='<input type="number" class="form-control" name="blog_post_details['+ bposthdr +'][data_serial]" value="'+bposthdr+'">';
            heading_rows+='</div>';
        heading_rows+='</div>';
    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trBlogPost' + bposthdr + '\').remove()">Delete Row</button></div></div>';
    heading_rows+='</td>';
    heading_rows+='</tr>';

    $('#blog_heading_rows tbody').append(heading_rows);

    tiny_mce('.blog_post_details');
    //jodit('.blog_post_details');

    bposthdr++;
  });



  $(document).on('change','#blog_post_category',function(){
    var category=$('#blog_post_category option:selected').val();

    if(category==='custom_category'){
      $('#custom_category_div').css('display','block');
    }else{
      $('#custom_category_div').css('display','none');
    }
  });


  $(document).on('click','#btn_add_media',function(){
    localStorage.setItem('media_operation', 'add_media');
  });


  $(document).on('click','.btn_update_media',function(){
    localStorage.setItem('media_operation', 'update_media');
    localStorage.setItem('media_row',$(this).data('media_row'));
  });

  $(document).on('click','#btn_cover_media',function(){
    localStorage.setItem('media_operation', 'add_cover_media');
  });

  $(document).on('click','#btn_update_cover_media',function(){
    localStorage.setItem('media_operation', 'update_cover_media');
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

        heading_rows+='<tr id="trBlogPost' + bposthdr + '">';
      heading_rows+='<td>';
      heading_rows+='<div class="form-group row">';
        heading_rows+='<div class="col-md-12">';
                heading_rows+='<h6>Content Detail</h6>';
                heading_rows+='<input type="hidden" name="blog_post_details['+ bposthdr +'][data_type]" value="ads">';
                heading_rows+='<input type="hidden" name="blog_post_details['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
                heading_rows+='<input type="number" class="form-control" name="blog_post_details['+ bposthdr +'][data_serial]" value="'+ bposthdr +'">';
                heading_rows+='<textarea class="form-control" rows="40" name="blog_post_details['+ bposthdr +'][post_content]" style="display:none;">'+d+'</textarea>';
                heading_rows+='<div class="col-md-12">'+d+'</div>';
              heading_rows+='</div>';
          heading_rows+='</div>';
      heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trBlogPost' + bposthdr + '\').remove()">Delete Row</button></div></div>';
      heading_rows+='</td>';
      heading_rows+='</tr>';

      $('#blog_heading_rows tbody').append(heading_rows);

      //tiny_mce();

      $('#adsModal').modal('hide');
      $('document.body').removeClass('modal-open');
      $('.modal-backdrop').remove();

      bposthdr++;
  });



  $(document).on('click','#btn_add_blog_faqus_row',function(){

      var faqs_rows='';

      faqs_rows+='<tr id="trBlogfaqsDetails'+blog_faqus_row+'">';
      faqs_rows+='<td>';
          faqs_rows+='<div class="row">';
            faqs_rows+='<input type="hidden" name="blog_faqus['+blog_faqus_row+'][data_type]" value="faqs"><textarea class="form-control" name="blog_faqus['+blog_faqus_row+'][ques]" aria-describedby="stream_faqus" placeholder="Question" rows="5"></textarea>';
            faqs_rows+='</div>';
  
          faqs_rows+='<div class="row">';
            faqs_rows+='<textarea class="form-control blog_post_details" name="blog_faqus['+blog_faqus_row+'][ans]" aria-describedby="stream_faqus" placeholder="Answer" rows="5"></textarea>';
            faqs_rows+='</div>';
            faqs_rows+='<div class="row">';
            faqs_rows+='<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trBlogfaqsDetails' + blog_faqus_row + '\').remove()" style="float:right;">Delete Row</button>';
            faqs_rows+='</div>';
          faqs_rows+='</td>';
      faqs_rows+='</tr>';

      $('table#form_blog_faqus_table').append(faqs_rows);


      tiny_mce('.blog_post_details');
      //jodit('.blog_post_details')

      blog_faqus_row++;

  });




  $('#form_blog_posts_add_edit').validate({
    rules:{
      blog_post_category:{
        valueNotEquals:'0'
      },
      blog_post_status:{
        valueNotEquals:'0'
      },
      blog_post_name:{
        required:true,
        minlength:10,
        maxlength:200
      },
      blog_post_title:{
        required:true,
        minlength:10,
        maxlength:255
      },
      blog_post_meta_title:{
        required:true,
        minlength:10,
        maxlength:255
      },
      blog_post_meta_keywords:{
        required:true,
        minlength:10,
        maxlength:255
      },
      blog_post_meta_desc:{
        required:true,
        minlength:10,
        maxlength:255
      },
      blog_post_meta_og_title:{
        required:true,
        minlength:10,
        maxlength:255
      },
      blog_post_mete_og_desc:{
        required:true,
        minlength:10,
        maxlength:255
      },
      "blog_post_details[]": "required"
    },
    messages:{
      blog_post_category:{
        valueNotEquals:'Select post category'
      },
      blog_post_status:{
        valueNotEquals:'Select post status'
      },
      blog_post_title:{
        required:'Enter title of the post',
        minlength:'Minimum 10 charachters required',
        maxlength:'Maximum 255 charachters are allowed'
      },
      blog_post_name:{
        required:'Enter name of the post',
        minlength:'Minimum 10 charachters required',
        maxlength:'Maximum 200 charachters are allowed'
      },
      blog_post_meta_title:{
        required:'Enter meta title of the post',
        minlength:'Minimum 10 charachters required',
        maxlength:'Maximum 255 charachters are allowed'
      },
      blog_post_meta_keywords:{
        required:'Enter keywords for the post',
        minlength:'Minimum 10 charachters required',
        maxlength:'Maximum 255 charachters are allowed'
      },
      blog_post_meta_desc:{
        required:'Enter meta description of the post',
        minlength:'Minimum 10 charachters required',
        maxlength:'Maximum 255 charachters are allowed'
      },
      blog_post_meta_og_title:{
        required:'Enter og meta title',
        minlength:'Minimum 10 charachters required',
        maxlength:'Maximum 255 charachters are allowed'
      },
      blog_post_mete_og_desc:{
        required:'Enter meta og desc',
        minlength:'Minimum 10 charachters required',
        maxlength:'Maximum 255 charachters are allowed'
      },
      "blog_post_details[]": "Enter blog content"
    },
    submitHandler:function(){
      Swal.fire({   
          title: "Are you sure?",   
          text: "You will be able to edit this data later",   
          icon: 'warning',  
          showCancelButton: true,   
          confirmButtonColor: '#002970', 
          cancelButtonColor: '#f11026', 
          confirmButtonText: "Yes, create",   
          cancelButtonText: "No, cancel",
          allowOutsideClick: false
      }).then((isConfirm)=>{

        if (isConfirm) {

          var formData=new FormData($('#form_blog_posts_add_edit')[0]);

          $.ajax({
            type:'POST',
            url:base_url+'/blogs_add',
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            target: '.preview',
            beforeSend:function(){
              //$('#btn_save_blog').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            },
            success:function(f){
              if(f.success){
               $('#btn_save_blog').html('Save').prop('disabled',false);
               Swal.fire({
                  icon: 'success',
                  title: f.success,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });

               // window.location.reload();           
              }else if(f.error){
                $('#btn_save_blog').prop('disabled',false);
                Swal.fire({
                  icon: 'error',
                  title: f.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });
              }else if(f.redirect){
                $('#btn_save_blog').prop('disabled',false);
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
    }
  });


  $('body').on('click','.btn_blog_post_del',function(){
      var post_id=$(this).data('post_id');

        Swal.fire({   
          title: "Are you sure?",   
          text: "You will be able to edit this data later",   
          icon: 'warning',  
          showCancelButton: true,   
          confirmButtonColor: '#002970', 
          cancelButtonColor: '#f11026', 
          confirmButtonText: "Yes, delete",   
          cancelButtonText: "No, cancel",
          allowOutsideClick: false
        }).then((isConfirm)=>{

          if (isConfirm) {

            $.ajax({
              type:'POST',
              url:base_url+'/blogs_delete',
              data:{[csrf_name]:csrf_hash,post_id:post_id},
              beforeSend:function(){
                //$('#btn_save_blog').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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

                var table=$('#blog_posts_list_table').DataTable();
                table.ajax.reload( null, false );

                  //window.location.reload();           
                }else if(f.error){
                  $('#btn_save_blog').prop('disabled',false);
                  Swal.fire({
                    icon: 'error',
                    title: f.error,
                    confirmButtonText:'Close',
                    confirmButtonColor:'#69da68',
                    allowOutsideClick: false,
                  });
                }else if(f.redirect){
                  $('#btn_save_blog').prop('disabled',false);
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
      });

  function load_ads(){
    $('#ads_list_table').DataTable().destroy();
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

  function tinyMceEditLink(editor) {
        editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
        editor.windowManager.open = function (t, r) {    // replace with our own function
          var modal = this.oldOpen.apply(this, [t, r]);  // call original

          if (t.title === "Insert/Edit Link") {
              $('.tox-dialog__footer-end').append(
                  '<button title="Custom button" type="button" data-alloy-tabstop="true" tabindex="-1" class="tox-button" id="custom_button">Custom button</button>'
              );
          }

          return modal; // Template plugin is dependent on this return value
        };
      }

    function tinyMceEditLinkFrom(editor) {
        editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
        editor.windowManager.open = function (t, r) {    // replace with our own function
            var modal = this.oldOpen.apply(this, [t, r]);  // call original

            var h='';
            h+='<select class="form-control" id="search_form">';
            h+='<option value="exam">Search from exams</option>';
            h+='<option value="exam_menu">Search from exams menu</option>';
            h+='<option value="college">Search from college</option>';
            h+='<option value="college_menu">Search from college menu</option>';
            h+='<option value="courses">Search from course</option>';
            h+='</select>'

            if (t.title === "Insert/Edit Link") {
                $('.tox-dialog__footer-end').append(h);

                $('#custom_button').on('click', function () {
                    //Replace this with your custom function
                    console.log('Running custom function')
                });
            }

            return modal; // Template plugin is dependent on this return value
        };
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
              h+='<optgroup label="Blogs">';
              h+='<option value="blogs">Search from blogs</option>';
              h+='</optgroup>';
              h+='</select>'

              if (t.title === "Insert/Edit Link") {
                  $('.tox-form').prepend('<div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false">'+h+'<div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div><div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false"><input type="text" role="combobox" aria-autocomplete="list" aria-haspopup="true" tabindex="-1" class="tox-textfield jAuto" aria-expanded="false" id="search-box"><div id="suggesstion-box"><ul id="search_tag-list"></ul></div><div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div>'
                  );

                  $('.tox-dialog__footer-end').prepend(
                      '<button title="Custom button" type="button" data-alloy-tabstop="true" tabindex="-1" class="tox-button" id="custom_button">Search</button>'
                  );

              }

              return modal; // Template plugin is dependent on this return value
          };
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

        function tiny_mce_v5(ctrl_area){
          tinymce.init({
            selector: ctrl_area,
            entity_encoding : "raw",
            height: 400,
            theme: 'silver',
            font_formats:"UbuntuCondensed-Regular;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
            plugins: [
              'advlist autolink lists link image charmap print preview hr anchor pagebreak',
              'searchreplace wordcount visualblocks visualchars code fullscreen table',
            ],
            toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
            toolbar2: 'forecolor backcolor emoticons | codesample',
            table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            setup: function(editor) {
              // Register our custom button callback function
              editor.on('init',function(e) {
                  //tinyMceEditLink(editor);
                  tinyMceEditLinkSearch(editor);
              });

            },
            table_appearance_options: true,
            table_use_colgroups: true
          });
        }

        
	function jodit(ctrl_area){
    var editor = Jodit.make(ctrl_area, {
    zIndex: 0,
    readonly: false,
    activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
    toolbarButtonSize: 'middle',
    theme: 'default',
    saveModeInCookie: false,
    spellcheck: true,
    editorCssClass: false,
    triggerChangeEvent: true,
    width: 'auto',
    height: 'auto',
    minHeight: 100,
    direction: '',
    language: 'auto',
    debugLanguage: false,
    i18n: 'en',
    tabIndex: -1,
    toolbar: true,
    enter: "P",
    defaultMode: Jodit.MODE_WYSIWYG,
    useSplitMode: false,
    colors: {
      greyscale:  ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
      palette:    ['#980000', '#FF0000', '#FF9900', '#FFFF00', '#00F0F0', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'],
      full: [
        '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
        '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
        '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
        '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
        '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#733554',
        '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
      ]
    },
    colorPickerDefaultTab: 'background',
    imageDefaultWidth: 300,
    removeButtons: [],
    disablePlugins: [],
    extraButtons: [],
    sizeLG: 900,
    sizeMD: 700,
    sizeSM: 400,
    sizeSM: 400,
    buttons: [
      'source', '|',
      'bold',
      'strikethrough',
      'underline',
      'italic', '|',
      'ul',
      'ol', '|',
      'outdent', 'indent',  '|',
      'font',
      'fontsize',
      'brush',
      'paragraph', '|',
      'image',
      'video',
      'table',
      'link', '|',
      'align', 'undo', 'redo', '|',
      'hr',
      'eraser',
      'copyformat', '|',
      'symbol',
      'fullsize',
      'print',
      'about'
    ],
    buttonsXS: [
      'bold',
      'image', '|',
      'brush',
      'paragraph', '|',
      'align', '|',
      'undo', 'redo', '|',
      'eraser',
      'dots'
    ],
    events: {},
    textIcons: false,
  });
  //editor.setEditorValue('<p>start</p>')
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
              $("#search-box").css("background", "#FFF url(https://www.waytoadmissions.com/public/data/app/app_data/loader_icon.gif) no-repeat 165px");
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


});