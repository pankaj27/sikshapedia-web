jQuery(function($) {
  'use strict';

  // tinymce.get('content').setMode('design');
  
  $('[data-toggle="tooltip"]').tooltip()

  $('#colleges_same_group_colleges').chosen({no_results_text: "Select Other Colleges In this Group"});

  $('#college_gallery_category').chosen();

  $('#top_colleges').chosen();

  $('#college_inner_menu_other_link').chosen();

  $('select[name=college_faculty_designation]').chosen();

   $('select[name=college_faculty_department]').chosen();

  $('#college_menu_widgets').chosen();
  $("#search_college_country").chosen({no_results_text: "Select Country"});
  $("#search_college_state").chosen({no_results_text: "Select State"});
  $("#search_college_city").chosen({no_results_text: "Select City"});
  $("#inst_type").chosen({no_results_text: "Select Institute Type"});
  $("#inst_course_streams").chosen({no_results_text: "Select Stream"});

 


  /**Leads**/
  $('body').on('change','#college_has_leads_access',function(){
    var d=$('#college_has_leads_access selected:option').val();

    if(d=='yes'){
      $('#college_leads_type').prop('disabled',false);
      $('#college_leads_per_day').prop('disabled',false);
      $('#college_max_leads').prop('disabled',false);
      $('#college_leads_start_date').prop('disabled',false);
      $('#college_leads_end_date').prop('disabled',false);
    }else{
      $('#college_leads_type').prop('disabled',true);
      $('#college_leads_per_day').prop('disabled',true);
      $('#college_max_leads').prop('disabled',true);
      $('#college_leads_start_date').prop('disabled',true);
      $('#college_leads_end_date').prop('disabled',true);
    }
  });

  if($('#college_leads_start_date').length>0) {

    // $("#college_leads_start_date").flatpickr({
    //     enableTime: true,
    //     dateFormat: "d-m-Y",
    // });

    $( "#college_leads_start_date" ).datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat:'dd-mm-yyyy',
    });
  }

  if($('#college_leads_end_date').length) {

    // $("#college_leads_end_date").flatpickr({
    //     enableTime: true,
    //     dateFormat: "d-m-Y",
    // });

    $( "#college_leads_end_date" ).datepicker({
      changeMonth: true,
      changeYear: true,
      dateFormat:'dd-mm-yyyy',
    });
  }


  // The DOM element you wish to replace with Tagify
  var input = document.querySelector('input[name=college_inner_menu_meta_keywords]');

  // initialize Tagify on the above input node reference
  new Tagify(input);




   // This set of validators requires the File API, so if we'ere in a browser
    // that isn't sufficiently "HTML5"-y, don't even bother creating them.  It'll
    // do no good, so we just automatically pass those tests.
    var is_supported_browser = !!window.File,
        fileSizeToBytes,
        formatter = $.validator.format;

    /**
     * Converts a measure of data size from a given unit to bytes.
     *
     * @param number size
     *   A measure of data size, in the give unit
     * @param string unit
     *   A unit of data.  Valid inputs are "B", "KB", "MB", "GB", "TB"
     *
     * @return number|bool
     *   The number of bytes in the above size/unit combo.  If an
     *   invalid unit is specified, false is returned
     */
    fileSizeToBytes = (function () {

        var units = ["B", "KB", "MB", "GB", "TB"];

        return function (size, unit) {

            var index_of_unit = units.indexOf(unit),
                coverted_size;

            if (index_of_unit === -1) {

                coverted_size = false;

            } else {

                while (index_of_unit > 0) {
                    size *= 1024;
                    index_of_unit -= 1;
                }

                coverted_size = size;
            }

            return coverted_size;
        };
    }());

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");

  jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
  }, "Letters, numbers, and underscores only please");

  $.validator.addMethod('filesize', function (value, element, param) {
    return this.optional(element) || (element.files[0].size <= param)
  }, 'File size must be less than {0}');

  $.validator.addMethod("roles", function(value, elem, param) {
   return $(".roles:checkbox:checked").length > 0;
  },"You must select at least one!");

  jQuery.validator.addMethod('ytVidId',function(value, element, arg){
     return this.optional(element) || /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/.test(value);
  },"URL is not a valid Youtube video url.");


   //Tinymce editor

   // function cxt(cxt){
   //    console.log(cxt);
   //  }

   // var fetchLinkLists = function() {
   //    var cxt=[];
   //    var m_enu=[]; 

   //    var j='';     

   //    $.getJSON(base_url+'/get_context',function(d){
   //      $.each(d,function(i,v){
   //      //console.log(i);      
   //        $.each(v,function(_i,_v){
   //          m_enu.push({title: _v.title, value: _v.value});
   //        });

   //        cxt.push({title: i, menu: m_enu});
   //      });
   //      cxt(cxt);
   //    });

      
      
   //  }; 


   $('body').on('click','#btn_create_inner_menu',function(){
    var menu_type=$(this).data('menu_type');
    var menu_type_id=$(this).data('menu_type_id');

    $('#collegeInnerMenuesModal').find('#menu_data_type_id').val(menu_type_id);
    $('#collegeInnerMenuesModal').find('#menu_data_type').val(menu_type);

   });




$('#collegeInnerMenuesModal').on('show.bs.modal', function () {
  $('#btn_save_college').css('display','none');
})

$("#collegeInnerMenuesModal").on("hidden.bs.modal", function () {
    $('#btn_save_college').css('display','block');
});

$('body').on('click','#btn_update_college_structure_data',function(){
        var college_id=$(this).data('college_id');
        var menu_url_id=$(this).data('url_id');
        var struct_data_type=$(this).data('struct_data_type');
        var data_name=$('#form_college_inner_menues_edit').find('#college_inner_menu_meta_title').val();
        var pre_id=$(this).data('pre_id');

        $.ajax({
          type:'POST',
          dataType:'josn',
          url:base_url+'/seo/update_college_struct_data',
          data:{'menu_url_id':menu_url_id,'college_id':college_id,'struct_data_type':struct_data_type,'data_name':data_name,[csrf_name]:csrf_hash},
          success:function(d){
            if(d.structure_data){
              const pre_elem = document.getElementById(pre_id);
              //var dd=JSON.parse(d.structure_data);
              pre_elem.innerHTML = prettyPrintJson.toHtml(d.structure_data);
            }else{
              alert(d.error);
            }
          }
        });
      });


      $('body').on('click','#btn_update_college_breadcrumb_structure_data',function(){
        var college_id=$(this).data('college_id');
        var menu_url_id=$(this).data('url_id');
        var struct_data_type=$(this).data('struct_data_type');
        var data_name=$('#form_college_inner_menues_edit').find('#college_inner_menu_meta_title').val();
        var pre_id=$(this).data('pre_id');

        $.ajax({
          type:'POST',
          dataType:'josn',
          url:base_url+'/seo/update_college_struct_data',
          data:{'menu_url_id':menu_url_id,'college_id':college_id,'struct_data_type':struct_data_type,'data_name':data_name,[csrf_name]:csrf_hash},
          success:function(d){
            if(d.structure_data){
              const pre_elem = document.getElementById(pre_id);
              //var dd=JSON.parse(d.structure_data);
              pre_elem.innerHTML = prettyPrintJson.toHtml(d.structure_data);
            }else{
              alert(d.error);
            }
          }
        });
      });
//Course meta update menu

$('body').on('click','.btn_update_meta',function(){

  var course_id=$(this).data('course_id');
  var college_id=$(this).data('college_id');

  var course_name=$(this).data('course_name');

  $.ajax({
    type:'POST',
    url:base_url+'/seo/college_course_meta_load',
    data:{[csrf_name]:csrf_hash,college_id:college_id,course_id:course_id},
    beforeSend:function(){
      $('#collegeCoursePageMetaModal').find('#college_course_meta_form_data').html('<img src="'+loader_icon+'">');
    },
    success:function(d){
        $('#collegeCoursePageMetaModal').find('#college_course_meta_form_data').html(d.html);
    }
  });



  $('#collegeCoursePageMetaModal').find('#collegeCoursePageMetaModalTitle').html(course_name);

  $('#collegeCoursePageMetaModal').modal('show');
});


$( "#collegeCoursePageMetaModal" ).on('shown.bs.modal', function(){
    $('.buy-now-wrapper').hide();
});

$("#collegeCoursePageMetaModal").on('hidden.bs.modal', function() { 
    $('.buy-now-wrapper').show();
});


$('body').on('click','.btn_course_is_popular',function(){
  var course_id=$(this).data('course_id');
  var college_id=$(this).data('college_id');
  var popular_value=$(this).data('popular_value');

  $.ajax({
    type:'POST',
    url:base_url+'/institutions/colleges/update_course_data_single',
    data:{[csrf_name]:csrf_hash,course_id:course_id,college_id:college_id,popular_value:popular_value},
    beforeSend:function(){
      $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
    },
    success:function(d){
      if(d.success){
        var table=$('#college_courses_fees_list_table').DataTable();
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
    }
  });
});
    


//fetchLinkLists();


  if($('#form_college').length>0){
    var html='';
      $.ajax( {
        type:'POST',
        url: base_url+'/institutions/colleges_list',
        data:{[csrf_name]:csrf_hash,college_id:college_id},
        success: function( data ) {
          if(data.colleges){
            $.each(data.colleges,function(i,v){
              html+='<option value="'+v['college_user_id']+'" '+v['selected']+'>'+v['college_name']+' ['+v['college_short_name']+']</option>';
            });

            $('#colleges_same_group_colleges').html(html);

            $('#colleges_same_group_colleges').trigger("chosen:updated");
            
          }
        }
      });
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

function tiny_mce(ctrl_area){
    tinymce.init({
      selector: ctrl_area,
      license_key: 'gpl',
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

        editor.on('change', function () {
          editor.save();
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

   if ($(".result_details").length) {

   //tiny_mce('.result_details');
   jodit('.result_details');
   //var result_details_editor = new FroalaEditor('.result_details');
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


  if ($(".college_info").length) {
    //tiny_mce('.college_info');
    jodit('.college_info');
    //var college_info_editor = new FroalaEditor('.college_info');
  }

  if ($(".review_detail").length) {
    //tiny_mce('.review_detail');
    jodit('.review_detail');
    //var review_detail_editor = new FroalaEditor('.review_detail');
  }

  if ($(".college_ranking_info").length) {
    //tiny_mce('.college_ranking_info');
    jodit('.college_ranking_info');
    //var college_ranking_info_editor = new FroalaEditor('.college_ranking_info');
  }


  $.validator.addMethod(
      "minFileSize",
      function (value, element, params) {

          var files,
              unit = params.unit || "KB",
              size = params.size || 100,
              min_file_size = fileSizeToBytes(size, unit),
              is_valid = false;

          if (!is_supported_browser || this.optional(element)) {

              is_valid = true;

          } else {

              files = element.files;

              if (files.length < 1) {

                  is_valid = false;

              } else {

                  is_valid = files[0].size >= min_file_size;

              }
          }

          return is_valid;
      },
      function (params, element) {
          return formatter(
              "File must be at least {0}{1} large.",
              [params.size || 100, params.unit || "KB"]
          );
      }
  );

  $.validator.addMethod(
        "maxFileSize",
        function (value, element, params) {

            var files,
                unit = params.unit || "KB",
                size = params.size || 100,
                max_file_size = fileSizeToBytes(size, unit),
                is_valid = false;

            if (!is_supported_browser || this.optional(element)) {

                is_valid = true;

            } else {

                files = element.files;

                if (files.length < 1) {

                    is_valid = false;

                } else {

                    is_valid = files[0].size <= max_file_size;

                }
            }

            return is_valid;
        },
        function (params, element) {
            return formatter(
                "File cannot be larger than {0}{1}.",
                [params.size || 100, params.unit || "KB"]
            );
        }
  );


  $.validator.addMethod('minImageWidth', function(value, element, minWidth) {
    return ($(element).data('imageWidth') || 0) >= minWidth;
  }, function(minWidth, element) {
    var imageWidth = $(element).data('imageWidth');
    return (imageWidth!="")
      ? ("Your image's width must be greater than " + minWidth + "px")
      : "Selected file is not an image.";
  });

  $.validator.addMethod('minImageHeight', function(value, element, minWidth) {
    return ($(element).data('imageHeight') || 0) >= minHeight;
  }, function(minHeight, element) {
    var imageHeight = $(element).data('imageHeight');
    return (imageHeight)
      ? ("Your image's width must be greater than " + minHeight + "px")
      : "Selected file is not an image.";
  });

  $('body').on('click','.btn_update_gallery',function(){
    var cid=$(this).data('college');
    $('#form_college_gallery_upload').find('#_college_id').val(cid);
  });

  
    $( "#collegeGallerUpdateModal" ).on('shown.bs.modal', function(){
      if($('#college_gallery_list_table').length>0){
        $('#college_gallery_list_table').DataTable().destroy();
        var college_id=$('#form_college_gallery_upload').find('#_college_id').val();
        alert(college_id);
        $('#college_gallery_list_table').DataTable({ 
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
              "url": base_url+'/institutions/colleges/gallery_search',
              "type": "POST",
              "data":{csrf_test_name:csrf_hash,_college:college_id}
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

 

  //Colleges
  if(_college==''){
    // var college_list_table=$('#college_list_table').DataTable({ 
    //     'bJQueryUI': false,
    //     'stateSave': true,
    //     'iDisplayLength':50,
    //     'responsive': true,
    //     "pagingType": "full_numbers",
    //     'language': {
    //       'paginate': {
    //         'first': "<<", // This is the link to the first page
    //         'previous': "<", // This is the link to the previous page
    //         'next': ">", // This is the link to the next page
    //         'last': ">>" // This is the link to the last page
    //       }
    //     },
    //     "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
    //     "processing": true, //Feature control the processing indicator.
    //     "serverSide": true, //Feature control DataTables' server-side processing mode.
    //     "order": [], //Initial no order.
    //     // Load data for the table's content from an Ajax source
    //     "ajax": {
    //         "url": base_url+'/institutions/colleges/search',
    //         "type": "POST",
    //         "data":{csrf_test_name:csrf_hash,state_id:$('#search_college_state :selected').val()}
    //     },
    //     //Set column definition initialisation properties.
    //     "columnDefs": [
    //     { 
    //         "targets": [ 0 ], //first column / numbering column
    //         "orderable": false, //set not orderable
    //     },
    //     ],
    // });

      loadColleges_table($('#search_college_state :selected').val(),$('#inst_type :selected').val(),$('#inst_courses_streams :selected').val(),0,$('#search_college_city :selected').val(),$('#search_college_country :selected').val());

      $('body').on('change','#inst_type',function(){
        var country_id=$('#search_college_country :selected').val();
        var state=$('#search_college_state :selected').val();
        var type=$('#inst_type :selected').val();
        var stream=$('#inst_courses :selected').val();
        var city=$('#search_college_city :selected').val();

        $('#college_list_table').DataTable().destroy();
        loadColleges_table(state,type,stream,0,city,country_id);
      });

      $('body').on('change','#inst_course_streams',function(){
        var country_id=$('#search_college_country :selected').val();
        var state=$('#search_college_state :selected').val();
        var type=$('#inst_type :selected').val();
        var stream=$('#inst_course_streams :selected').val();
        var city=$('#search_college_city :selected').val();

        $('#college_list_table').DataTable().destroy();
        loadColleges_table(state,type,stream,0,city,country_id);
      });

      $('body').on('change','#search_college_operator',function(){
        var created_by=$('#search_college_operator :selected').val();


        $('#college_list_table').DataTable().destroy();
        loadColleges_table(0,0,0,created_by);
      });



      function loadColleges_table(state,inst_type,inst_course_streams,created_by=0,city=0,country=99){
        var college_list_table=$('#college_list_table').DataTable({ 
          'bJQueryUI': false,
          'stateSave': true,
          'iDisplayLength':5,
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
          "lengthMenu": [[5,10,25,50,75,100,250,500,1000,1500,3000,4500,5000,5500,6000,10000], [5,10,25,50,75,100,250,500,1000,1500,3000,4500,5000,5500,6000,1000]],
          "processing": true, //Feature control the processing indicator.
          "serverSide": true, //Feature control DataTables' server-side processing mode.
          "order": [], //Initial no order.
          // Load data for the table's content from an Ajax source
          "ajax": {
              "url": base_url+'/institutions/colleges/search',
              "type": "POST",
              "data":{csrf_test_name:csrf_hash,state_id:state,inst_type:inst_type,inst_course_streams:inst_course_streams,created_by:created_by,city_id:city,country_id:country}                 
          },
          "drawCallback": function ( settings ) {
            var msghtml='';
            if(settings.json.recordsPotentialDuplicates>0){
              msghtml='<div class="alert alert-danger"><strong>In your ID and on this page System Found Potential Duplicate Data:'+settings.json.recordsPotentialDuplicates+'</strong> Collect these #ID\'s and send to superadmin.Till then you will not be able to Add any data and withouth correction of these data your data upload will not be canculated.</div>';
            }else{
              msghtml='<div class="alert alert-success"><strong>In your ID System Found Potential Duplicate Data:'+settings.json.recordsPotentialDuplicates+'</strong></div>';
            }

            $('#potential_duplicates').html(msghtml);
          },
          "initComplete": function(settings, json){ 
             var info = this.api().page.info();

             console.log(json);
             $('#total_entry').html(' Total records:'+info.recordsTotal);            
             
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

    $('body').on('change','#search_college_country',function(){
      var country_id=$('#search_college_country :selected').val();
        var state=$('#search_college_state :selected').val();
        var type=$('#inst_type :selected').val();
        var stream=$('#inst_course_streams :selected').val();
        var city=$('#search_college_city :selected').val();


      $('#college_list_table').DataTable().destroy();
      loadColleges_table(state,type,stream,0,city,country_id);

      var html='<option value="0">Select State</option>';
      $.ajax({
        type:'POST',
        url:base_url+'/country/get_inst_states',
        data:{csrf_test_name:csrf_hash,country_id:country_id},
        success:function(d){
          if(d.states!=''){
            $.each(d.states,function(i,v){
              html+='<option value="'+v.college_state_id+'">'+v.state_name+'</option>';
            });
          }           

          $('#search_college_state').html(html);
          $("#search_college_state").trigger("chosen:updated");
        }
      });

      //load_streams(country_id,state_id,city_id);
    });

    $('body').on('change','#search_college_state',function(){
      var country_id=$('#search_college_country :selected').val();

      var state=$('#search_college_state :selected').val();
      var type=$('#inst_type :selected').val();
      var stream=$('#inst_courses :selected').val();
      var city=$('#search_college_city :selected').val()

      $('#college_list_table').DataTable().destroy();
      loadColleges_table(state,type,stream,0,city,country_id);

      var chtml='<option value="0">Select City</option>';
      $.ajax({
        type:'POST',
        url:base_url+'/country/get_inst_cities',
        data:{csrf_test_name:csrf_hash,state_id:state},
        success:function(d){
          if(d.cities!=''){
            $.each(d.cities,function(i,v){
              chtml+='<option value="'+v.college_city_id+'">'+v.city_name+'</option>';
            });
          }           

          $('#search_college_city').html(chtml);
          $("#search_college_city").trigger("chosen:updated");
        }
      });
    });

    $('body').on('change','#search_college_city',function(){
      // var table=$('#college_list_table').DataTable();
      // table.ajax.reload( null, false );

      var state=$('#search_college_state :selected').val();
      var type=$('#inst_type :selected').val();
      var stream=$('#inst_courses :selected').val();
      var city=$('#search_college_city :selected').val()

      $('#college_list_table').DataTable().destroy();
      loadColleges_table(state,type,stream,0,city);
    });

    $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
 
        // Get the column API object
        var column = college_list_table.column( $(this).attr('data-column') );
 
        // Toggle the visibility
        column.visible( ! column.visible() );
    });


    $('body').on('click','.btn_courses_offered',function(){
      var college=$(this).attr('data-college');
      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/get_courses',
        data:{csrf_test_name:csrf_hash,college:college,selction_type:'selectbox'},
        success:function(d){
          if(d.html!=''){
            $('#courseModal').find('#btn_add_courses_to_college').attr('disabled',false);
            $('#courseModal').find('#college').val(college);
          }

          $('#courseModal').find('form #college_courses').html(d.html);
          $('#courseModal').find('form #college_courses').trigger("chosen:updated");         
        }
      });
      // $.ajax({
      //   type:'POST',
      //   url:base_url+'/institutions/colleges/get_courses',
      //   data:{csrf_test_name:csrf_hash,college:college},
      //   success:function(d){
      //     if(d.html!=''){
      //       $('#courseModal').find('#btn_add_courses_to_college').attr('disabled',false);
      //       $('#courseModal').find('#college').val(college);
      //     }

      //     $('#courseModal').find('form .row#courses_offered_row').html(d.html);          
      //   }
      // });
    });


    // $('#courseModal').on('shown.bs.modal', function (e){
    //   var college=$('#courseModal').find('#college').val();
    //   $.ajax({
    //     type:'POST',
    //     url:base_url+'/institutions/colleges/get_courses',
    //     data:{csrf_test_name:csrf_hash,college:college,selction_type:'selectbox'},
    //     success:function(d){
    //       if(d.html!=''){
    //         $('#courseModal').find('#btn_add_courses_to_college').attr('disabled',false);
    //         $('#courseModal').find('#college').val(college);
    //       }

    //       $('#courseModal').find('form #college_courses').html(d.html);
    //       $('#courseModal').find('form #college_courses').trigger("chosen:updated");         
    //     }
    //   });
    // });


    $('body').on('click','.btn_quick_data_update',function(){
      var college=$(this).attr('data-college');
      var college_name=$(this).attr('data-college_name');
      var college_ph=$(this).attr('data-college_ph');
      var college_email=$(this).attr('data-college_email');
      var college_estd=$(this).attr('data-college_estd');

      var college_pincode=$(this).attr('data-college_pincode');
      var college_address=$(this).attr('data-college_address');

      var college_logo_name=$(this).attr('data-logo_name');
      var college_banner_name=$(this).attr('data-banner_name');

      var college_is_top_home=$(this).attr('data-college_is_top_homepage');
      var college_is_featured=$(this).attr('data-college_is_featured');
      var college_is_verified=$(this).attr('data-college_verified');

      var college_has_leads_access=$(this).attr('data-has_leads_access');
      var college_max_leads=$(this).attr('data-max_leads');
      var college_leads_per_day=$(this).attr('data-leads_per_day');
      var college_leads_start=$(this).attr('data-leads_start');
      var college_leads_end=$(this).attr('data-leads_end');

      //alert(college_pincode);

      $('#collegeQuickUpdateModal').find('#_college_id').val(college);
      $('#collegeQuickUpdateModal').find('#college_name').val(college_name);
      $('#collegeQuickUpdateModal').find('#college_phone').val(college_ph);

      $('#collegeQuickUpdateModal').find('#college_email').val(college_email);
      $('#collegeQuickUpdateModal').find('#college_estd').val(college_estd);
      $('#collegeQuickUpdateModal').find('input[name="college_pincode"]').val(college_pincode);
      $('#collegeQuickUpdateModal').find('textarea[name="college_address"]').text(college_address);

      $('#collegeQuickUpdateModal').find('#college_logo_name').val(college_logo_name);
      $('#collegeQuickUpdateModal').find('#college_banner_name').val(college_banner_name);

      $('#collegeQuickUpdateModal').find('#college_is_featured').val(college_is_featured);
      $('#collegeQuickUpdateModal').find('#college_is_top_college').val(college_is_top_home);
      $('#collegeQuickUpdateModal').find('#college_admin_verified').val(college_is_verified);

      $('#collegeQuickUpdateModal').find('#collegeQuickUpdateModalTitle').html('Update '+college_name);


      $('#collegeQuickUpdateModal').find('#college_has_leads_access').val(college_has_leads_access).trigger('change');
      $('#collegeQuickUpdateModal').find('#college_leads_max').val(college_max_leads);
      $('#collegeQuickUpdateModal').find('#college_leads_per_day').val(college_leads_per_day);
      $('#collegeQuickUpdateModal').find('#college_start_date').val(college_leads_start);
      $('#collegeQuickUpdateModal').find('#college_end_date').val(college_leads_end);

      if(college_has_leads_access=='yes'){
        $('#collegeQuickUpdateModal').find('#college_leads_max').attr('disabled',false);
        $('#collegeQuickUpdateModal').find('#college_leads_per_day').attr('disabled',false);
        $('#collegeQuickUpdateModal').find('#college_start_date').attr('disabled',false);
        $('#collegeQuickUpdateModal').find('#college_end_date').attr('disabled',false);
      }
    });

    $('body').on('keyup','#search_param_course',function(){
      var sr=$('#search_param_course').val();
      var college=$('#college').val();
      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/get_courses',
        data:{csrf_test_name:csrf_hash,college:college,_search_param:sr},
        success:function(d){
          if(d.html!=''){
            $('#courseModal').find('#btn_add_courses_to_college').attr('disabled',false);
            $('#courseModal').find('#college').val(college);
          }

          $('#courseModal').find('form .row#courses_offered_row').html(d.html);          
        }
      });
    });

    $('body').on('click','.btn_categories',function(){
      var college=$(this).attr('data-college');
      var college_country=$(this).attr('data-college_country');
      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/get_categories',
        data:{csrf_test_name:csrf_hash,college:college,college_country:college_country},
        success:function(d){
          if(d.html!=''){
            $('#categoriesModal').find('#btn_add_categories_to_college').attr('disabled',false);
            $('#categoriesModal').find('#college').val(college);
          }

          $('#categoriesModal').find('form .row').html(d.html);
          
        }
      });
    });


    $('#form_college_courses').validate({
      rules:{
        "course_streams[]":{
          required: true, 
          minlength: 1
        }
      }, 
      messages: { 
        "course_streams[]": "Please select at least one course."
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/assign_courses',
          data:$('#form_college_courses').serialize(),
          beforeSend:function(){
            $('#btn_add_courses_to_college').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
              var table=$('#college_list_table').DataTable();
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
            $('#btn_add_courses_to_college').html('Update').prop('disabled',false);
          }
        });
      }
    });


    $('#form_college_categories').validate({
      rules:{
        "college_categories[]":{
          required: true, 
          minlength: 1
        }
      }, 
      messages: { 
        "college_categories[]": "Please select at least one category."
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/assign_categories',
          data:$('#form_college_categories').serialize(),
          beforeSend:function(){
            $('#btn_add_categories_to_college').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
              var table=$('#college_list_table').DataTable();
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
            $('#btn_add_categories_to_college').html('Update').prop('disabled',false);
          }
        });
      }
    });


    $('body').on('click','.btn_change_single_data',function(){
      var _college=$(this).attr('data-college');
      var _field=$(this).attr('data-field');
      var _field_data=$(this).attr('data-field_value');

      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/update_single',
        data:{csrf_test_name:csrf_hash,_college:_college,_field:_field,_field_data:_field_data},
        success:function(d){
          if(d.success){
            Swal.fire({
              icon: 'success',
              title: d.success,
              confirmButtonText:'Close',
              allowOutsideClick: false,
            });
            var table=$('#college_list_table').DataTable();
            table.ajax.reload( null, false );
          }else if(d.error){
            Swal.fire({
              icon: 'error',
              title: d.error,
              confirmButtonText:'Close',
              allowOutsideClick: false,
            });
          }
        }
      });
    });


     $('body').on('click','.btn_change_featured_college_menu_data',function(){
        var _college_name=$(this).attr('data-college_name');

        $('#featuredCollegeModal').find('.modal-title').html(_college_name);
     });


  }
   

  if(_college!=''){
    if ($(".js-example-basic-single").length) {
      $(".js-example-basic-single").select2();
    }


    
    // $('body').on('click','.btn_edit_college_inner_menu',function(){
    //   var cid=$(this).data('cid');
    //   var aid=$(this).data('aid');
    //   var serial=$(this).data('serial');
    //   var mtype=$(this).data('meny_type');
    //   var mname=$(this).data('menu_name');
    //   var active=$(this).data('active');
    //   $('#collegeInnerMenuesModal').find('form#form_college_inner_menues #college_inner_menu_name').val(mname);
    //   $('#collegeInnerMenuesModal').find('form#form_college_inner_menues #college_inner_menu_serial').val(serial);
    //   $('#collegeInnerMenuesModal').find('form#form_college_inner_menues #college_inner_menu_id').val(aid);
    //   $('#collegeInnerMenuesModal').find('form#form_college_inner_menues #college_inner_menu_type').val(serial).trigger('change');
    //   $('#collegeInnerMenuesModal').find('form#form_college_inner_menues #college_inner_menu_status').val(active).trigger('change');
    // });

    $('body').on('change','#college_inner_menu_type',function(){
      var selected_val=$('#college_inner_menu_type option:selected').val();

      if(selected_val==16){
        $('#special_menu_type_link_div').css('display','block');
        $('.menu_des_div').css('display','none');
      }else{
        $('#special_menu_type_link_div').css('display','none');
        $('.menu_des_div').css('display','block');
      }
    });

    $('#college_menu_type_list_table').DataTable({ 
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
            "url": base_url+'/institutions/colleges/inner_menu_serach',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,_college:_college,college_type:college_type}
        },
        //Set column definition initialisation properties.
        "columnDefs": [
        { 
            "targets": [ 0 ], //first column / numbering column
            "orderable": false, //set not orderable
        },
        ],
    });



    $('#college_faculties_list_table').DataTable({ 
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
            "url": base_url+'/institutions/colleges/faculty_search',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,_college:_college}
        },
        //Set column definition initialisation properties.
        "columnDefs": [
        { 
            "targets": [ 0 ], //first column / numbering column
            "orderable": false, //set not orderable
        },
        ],
    });


    $('body').on('click','.btn_update_college_inner_menu',function(){
      var cid=$(this).attr('data-cid');
      var menu_id=$(this).attr('data-aid');
      var menu_type_name=$(this).attr('data-menu_name');

      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/inner_menu_update',
        data:{csrf_test_name:csrf_hash,cid:cid,menu_id:menu_id,menu_type_name:menu_type_name},
        success:function(d){
          if(d.success){
            var table=$('#college_menu_type_list_table').DataTable();
            table.ajax.reload( null, false );
          }
        }
      });
    });




  $('body').on('click','.btn_edit_college_inner_menu',function(){

    var menu_name=$(this).data('menu_name');
    var menu_id=$(this).data('aid');
    var menu_serial=$(this).data('serial');
    var menu_active=$(this).data('active');
    var menu_link=$(this).data('menu_url')

    //$('#btn_save_college').css('display','none');

    $('#collegeInnerMenuesEditModal').find('#collegeInnerMenuesEditModalTitle').html('<a href="'+menu_link+'" target="_blank">'+menu_name+'</a>');
    // $('#collegeInnerMenuesEditModal').find('#college_inner_menu_id').val(menu_id);
    // $('#collegeInnerMenuesEditModal').find('#college_inner_menu_name').val(menu_name);
    // $('#collegeInnerMenuesEditModal').find('#college_inner_menu_serial').val(menu_serial);
    //$('#collegeInnerMenuesEditModal').find('#college_inner_menu_status').val(menu_active).triger('change');

    $.ajax({
      type:'POST',
      url:base_url+'/institutions/load_inner_menu_form_data',
      data:{[csrf_name]:csrf_hash,college_id:_college,college_menu_id:menu_id},
      beforeSend:function(){
        $('#inner_menu_form_data').html('<img src="'+loadergif+'" style="text-align: center;">');
      },
      success:function(d){
        if(d.html){
          
          $('#inner_menu_form_data').html(d.html);
          // var handleExample = document.querySelector("#widget_sortable2");
          // let sortable =new Sortable(handleExample, {
          //   handle: '.handle', // handle's class
          //   animation: 150,
          //   ghostClass: 'bg-light'
          // });
          // sortable.reAssignList(handleExample);
          
        }else{
          $('#inner_menu_form_data').html('<div class="alert alert-error">'+d.error+'</div>');
        }
      }
    });

    $('#collegeInnerMenuesEditModal').modal('show');


  });

  $('#collegeInnerMenuesEditModal').on('hidden.bs.modal', function () {
    $('#inner_menu_form_data').html('');
  });

     

    // $('#form_college_inner_menues').validate({
    //   rules:{
    //     college_inner_menu_type:{
    //       valueNotEquals:'0'
    //     },
    //     college_inner_menu_name:{
    //       required:true
    //     },
    //     college_inner_menu_serial:{
    //       required:true,
    //       digits: true
    //     }
    //   },
    //   messages:{
    //     college_inner_menu_type:{
    //       valueNotEquals:'Select menu type'
    //     },
    //     college_inner_menu_name:{
    //       required:'Menu name is invalid'
    //     },
    //     college_inner_menu_serial:{
    //       required:'Please enter serial number',
    //       digits: 'Only digits are allowed'
    //     }
    //   },
    //   submitHandler:function(){
    //     $.ajax({
    //       type:'POST',
    //       url:base_url+'/institutions/colleges/inner_menu_add',
    //       data:$('#form_college_inner_menues').serialize(),
    //       beforeSend:function(){
    //          $('#btn_college_inner_menues').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
    //       },
    //       success:function(d){
    //         if(d.success){

    //           var cid=$(this).attr('data-cid');
    //           var menu_id=$(this).attr('data-aid');
    //           var menu_type_name=$(this).attr('data-menu_name');

    //           $.ajax({
    //             type:'POST',
    //             url:base_url+'/institutions/colleges/inner_menu_update',
    //             data:{csrf_test_name:csrf_hash,cid:cid,menu_id:menu_id,menu_type_name:menu_type_name},
    //             success:function(d){
    //             }
    //           });

    //           Swal.fire({
    //             icon: 'success',
    //             title: d.success,
    //             confirmButtonText:'Close',
    //             confirmButtonColor:'#69da68',
    //             allowOutsideClick: false,
    //           });
    //           //$('#form_college_inner_menues')[0].reset();
    //           $('#form_college_inner_menues').find('#college_inner_menu_name').val('');
    //           $('#form_college_inner_menues').find('#college_inner_menu_id').val('');
    //           $('#form_college_inner_menues').find('#college_inner_menu_serial').val('');
    //           var table=$('#college_menu_type_list_table').DataTable();
    //           table.ajax.reload( null, false );
    //           $('#btn_college_inner_menues').html('Save').attr('disabled',false);
    //         }else{
    //           Swal.fire({
    //             icon: 'error',
    //             title: d.error,
    //             confirmButtonText:'Close',
    //             confirmButtonColor:'#69da68',
    //             allowOutsideClick: false,
    //           });
    //           $('#btn_college_inner_menues').html('Save').attr('disabled',false);
    //         }
    //       }
    //     });
    //   }
    // });


    $('body').on('change','#college_gallery_category',function(){
      var v=this.value;

      if(v==='user_youtube_video_gallery_general' || v==='user_youtube_video_gallery_academic_building'){
        $('#form_gallery').find('div#college_gallery_image_div').css({'display':'none'});
        $('#form_gallery').find('div#college_gallery_video_div').css({'display':'block'});
      }else{
        $('#form_gallery').find('div#college_gallery_image_div').css({'display':'block'});
        $('#form_gallery').find('div#college_gallery_video_div').css({'display':'none'});
      }
    });


    $('#form_gallery').validate({
      rules:{
        college_gallery_category:{
          valueNotEquals:'0'
        },
        college_gallery_image:{
          required: function() {
            return ($('#college_gallery_category').val() != '0' || $('#college_gallery_category').val() != 'user_intro_video' || $('#college_gallery_category').val() != 'user_youtube_video_gallery_general' || $('#college_gallery_category').val() != 'user_youtube_video_gallery_academic_building');
          },
          extension: "jpeg|jpg|png|webp",
          maxFileSize: {
              "unit": "KB",
              "size": '200'
          },
          minFileSize: {
              "unit": "KB",
              "size": "1"
          }
        },
        college_gallery_video_link:{
          required: function() {
            return ($('#college_gallery_category').val() != '0' || $('#college_gallery_category').val() != 'user_banner' || $('#college_gallery_category').val() != 'infrustructure_banner' || $('#college_gallery_category').val() != 'extracurricular_banner' || $('#college_gallery_category').val() != 'events_banner' || $('#college_gallery_category').val() != 'campus_facilities_banner' || $('#college_gallery_category').val() != 'laboratories_banner' || $('#college_gallery_category').val() != 'media_communication_banner' || $('#college_gallery_category').val() != 'tourism_banner' || $('#college_gallery_category').val() != 'health_science_banner' || $('#college_gallery_category').val() != 'engineering_technology_banner' || $('#college_gallery_category').val() != 'design_life_style_banner' || $('#college_gallery_category').val() != 'computing_analytics_banner' || $('#college_gallery_category').val() != 'business_management_banner');
          }
        }
      },
      messages:{
        college_gallery_category:{
          valueNotEquals:'Select gallery category'
        },
        college_gallery_image:{
          required: 'Select gallery image',
          extension: "Allowed file types are jpeg,jpg,png,webp"
        },
        college_gallery_video_link:{
          required: 'Enter youtube video link'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/gallery_add',
          data:new FormData($('#form_gallery')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_save_form_gallery').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_form_gallery').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              var table=$('#college_gallery_list_table').DataTable();
              table.ajax.reload( null, false );
              $('#form_gallery').find('#college_gallery_image').val(null);
              $('#form_gallery').find('#college_gallery_category').val('0').trigger('change'); 
              window.location.reload();          
            }else if(f.error){
              $('#btn_save_form_gallery').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              window.location.reload(); 
            }else if(f.redirect){
              $('#btn_save_form_gallery').html('Save').prop('disabled',false);
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
            $('#btn_save_college_gallry').html('Save').attr('disabled',false);
            window.location.reload(); 
          },
          resetForm: true 
        });
      }
    });



    $('#form_college_faculty').validate({
      rules:{
        college_faculty_name:{
          required:true
        },
        college_faculty_email:{
          email:true
        },
        college_faculty_experience:{
          required:false
        }
      },
      messages:{
        college_faculty_name:{
          required:'Please enter name'
        },
        college_faculty_email:{
          email:'Email is not valid'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/faculty_add',
          data:$('#form_college_faculty').serialize(),
          beforeSend:function(){
            $('#btn_save_form_gallery').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_college_faculty').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              var table=$('#college_faculties_list_table').DataTable();
              table.ajax.reload( null, false );
              if(f.redirect){
                window.location.href=f.redirect;
              }
              //$('#form_college_faculty').find('#college_gallery_image').val(null);
              //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
            }else if(f.error){
              $('#btn_save_college_faculty').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_college_faculty').html('Save').prop('disabled',false);
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


    $('body').on('click','.btn_del_college_gallery_file',function(){
      let _file=$(this).attr('data-aid');
      let _college=$(this).attr('data-cid');

      Swal.fire({
        title: "Do you want to delete the File?",
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69da68',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value){
          $.ajax({
            type:'POST',
            url:base_url+'/institutions/colleges/gallery_delete',
            data:{_college:_college,_file:_file,csrf_test_name:csrf_hash},
            beforeSend:function(){

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
                var table=$('#form_gallery_list_table').DataTable();
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
            }
          });
        }
      });
    });


    $('body').on('click','.btn_del_college_faculty',function(){
      var _faculty=$(this).attr('data-aid');

      Swal.fire({
        title: "Do you want to delete the Faculty data?",
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69da68',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value){
          $.ajax({
            type:'POST',
            url:base_url+'/institutions/colleges/faculty_delete',
            data:{_college:_college,_faculty:_faculty,csrf_test_name:csrf_hash},
            beforeSend:function(){

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
                var table=$('#college_faculties_list_table').DataTable();
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
            }
          });
        }
      });
    });


    //Courses


    //inner menues

    $('body').on('click','.btn_del_college_inner_menu',function(){
      var m_id=$(this).attr('data-aid');
      var c_id=$(this).attr('data-cid');

      Swal.fire({
        title: "Do you want to delete this menu?",
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69da68',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value){
          $.ajax({
            type:'POST',
            url:base_url+'/institutions/colleges/inner_menu_delete',
            data:{c_id:_college,m_id:m_id,csrf_test_name:csrf_hash},
            beforeSend:function(){

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
                var table=$('#college_menu_type_list_table').DataTable();
                table.ajax.reload( null, false );
                setTimeout(function(){
                  window.location.reload();
                },1200);
              }else{
                Swal.fire({
                  icon: 'error',
                  title: d.error,
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

    //inner menues

   


    $(document).on('change','#course_duration',function(){

      //alert(cost_html);
      var i=0;
      var dy=$('#course_duration :selected').val();
      var html='';

      
     // $('#cost_category_div input:checkbox').attr('checked',false);

      // $("#cost_category_div input[type=checkbox]:checked").each(function () {
      //     selected.push($(this).attr('data-categorytable'));
      // });

      

      //          console.log(selected);
      

      
      
    });

    $('body').on('change','.course_cost_categories',function(){
      var table_id=$(this).attr('data-categorytable');
      var data_cat=$(this).attr('data-category');      
      if($(this).is(":checked")) {        
        gen_cost_table(table_id,data_cat,'1');
      } else {
        gen_cost_table(table_id,data_cat,'0');
      }
    });

    // $('body').on('change','#course_cost_type',function(){
    //   var table_id=$(this).attr('data-categorytable');
    //   var data_cat=$(this).attr('data-category');      
    //   if($(this).is(":checked")) {        
    //     gen_cost_table(table_id,data_cat,'1');
    //   } else {
    //     gen_cost_table(table_id,data_cat,'0');
    //   }
    // });



    function gen_cost_table(table_id,data_cat,data_checked){
      var cost_type=$('#course_cost_type :selected').val();
      var i=0;
      var dy=$('#course_duration :selected').val();
      var course_cost_breakup_type=$('#course_cost_breakup_type :selected').val();
      var disabled='';
      var html='';

      //alert(data_checked);

      if(course_cost_breakup_type=='2'){
        disabled='readonly';
      }else{
        disabled='';
      }

      if(dy!=''){
        if(data_checked=='1'){          

          for (var i = selected_dy_last_val; i <= dy; i++){

            if(cost_type=='1'){

              html+='<tr>';
              html+='<td>'+ordinal_suffix_of(i)+' Year <input type="hidden" name="registration_course_fees['+data_cat+']['+i+'][course_year]" value="'+i+'"></td>';
              html+='<td>';
              html+='<input type="number" class="form-control" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_tution_total]" '+disabled+'>';
              html+='</td>';
               html+='<td>';
              html+='<input type="number" class="form-control" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_admission_total]" '+disabled+'>';
              html+='</td>';
               html+='<td>';
              html+='<input type="number" class="form-control" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_reg_total]" '+disabled+'>';
              html+='</td>';
               html+='<td>';
              html+='<input type="number" class="form-control" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_exam_total]" '+disabled+'>';
              html+='</td>';
               html+='<td>';
              html+='<input type="number" class="form-control" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_other_total]" '+disabled+'>';
              html+='</td>';
              html+='<tr>';

            }else  if(cost_type=='2'){
                html+='<tr>';
                  html+='<td>'+ordinal_suffix_of(i)+' Year <input type="hidden" name="registration_course_fees['+data_cat+']['+i+'][course_year]" value="'+i+'"></td>';
                  html+='<td>';
                    html+='<table class="table">';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_tution_fee_sem_1]"  '+disabled+'></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_tution_fee_sem_2]"  '+disabled+'></td></tr>';
                    html+='</table>';
                  html+='</td>';
                  html+='<td>';
                    html+='<table>';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_admisssion_fee_sem_1]"  '+disabled+'></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_admisssion_fee_sem_2]"  '+disabled+'></td></tr>';
                    html+='</table>';
                  html+='</td>';
                  html+='<td>';
                    html+='<table>';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_reg_fee_sem_1]"  '+disabled+'></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_reg_fee_sem_2]"  '+disabled+'></td></tr>';
                    html+='</table>';
                  html+='</td>';
                  html+='<td>';
                    html+='<table>';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_exam_fee_sem_1]"  '+disabled+'></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_exam_fee_sem_2]"  '+disabled+'></td></tr>';
                    html+='</table>';
                  html+='</td>';
                  html+='<td>';
                    html+='<table>';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_other_fee_sem_1]"  '+disabled+'></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="form-control" value="0" aria-invalid="false" name="registration_course_fees['+data_cat+']['+i+'][course_other_fee_sem_2]"  '+disabled+'></td></tr>';
                    html+='</table>';
                  html+='</td>';
                html+='</tr>';
            }
             
          }

          if(course_cost_breakup_type=='2'){
            html+='<tr>';
            html+='<td colspan="4"></td>';
            html+='<td>Total</td>';
            html+='<td>';
              html+='<input type="number" class="form-control" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees_total['+data_cat+']">';
              html+='</td>';
            html+='</tr>';
          }
          
          $('#'+table_id+' tbody').html(html)
        }else if(data_checked=='0'){
          $('#'+table_id+' tbody').html(html);
        } 
      } 
    }

    function gen_fees_table(){
      var cost_type=$('#course_cost_type :selected').val();
      var i=0;
      var dy=$('#course_duration :selected').val();
      var html=''; 

      if(dy!=''){
        for (var i = selected_dy_last_val; i <= dy; i++) {

          if(cost_type=='1'){
            html+='<tr>';
            html+='<td>'+ordinal_suffix_of(i)+' Year <input type="hidden" name="registration_course_fees['+i+'][course_year]" value="'+i+'"></td>';
            html+='<td>';
            html+='<input type="number" class="form-control" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_tution_total]">';
            html+='</td>';
            html+='<tr>';

            if(cost_html!=''){
              $('#course_price_list_table_1 tbody').html(cost_html+html);
            }else if(cost_html==''){
              $('#course_price_list_table_1 tbody').html(html);
            }
         }else if(cost_type=='2'){
            html+='<tr>';
                  html+='<td>'+ordinal_suffix_of(i)+' Year <input type="hidden" name="registration_course_fees['+i+'][course_year]" value="'+i+'"></td>';
                  html+='<td>';
                    html+='<table class="table">';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_tution_fee_sem_1]"></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_tution_fee_sem_2]"></td></tr>';
                    html+='</table>';
                  html+='</td>';
                  html+='<td>';
                    html+='<table>';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_admisssion_fee_sem_1]"></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_admisssion_fee_sem_2]"></td></tr>';
                    html+='</table>';
                  html+='</td>';
                  html+='<td>';
                    html+='<table>';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_reg_fee_sem_1]"></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_reg_fee_sem_2]"></td></tr>';
                    html+='</table>';
                  html+='</td>';
                  html+='<td>';
                    html+='<table>';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_exam_fee_sem_1]"></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_exam_fee_sem_2]"></td></tr>';
                    html+='</table>';
                  html+='</td>';
                  html+='<td>';
                    html+='<table>';
                      html+='<tr><td><label>Semester 1</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_other_fee_sem_1]"></td></tr>';
                      html+='<tr><td><label>Semester 2</label></br>';
                      html+='<input type="number" min="0" class="" value="0" aria-invalid="false" name="registration_course_fees['+i+'][course_other_fee_sem_2]"></td></tr>';
                    html+='</table>';
                  html+='</td>';
                html+='</tr>';

                if(cost_html!=''){
                  $('#course_price_list_table tbody').html(cost_html+html);
                }else if(cost_html==''){
                  $('#course_price_list_table tbody').html(html);
                }
          }        
        }
      }
    }

    $('#college_courses_fees_list_table').DataTable({ 
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
            "url": base_url+'/institutions/colleges/courses_search',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,_college:_college}
        },
        //Set column definition initialisation properties.
        "columnDefs": [
        { 
            "targets": [ 0 ], //first column / numbering column
            "orderable": false, //set not orderable
        },
        ],
    });


    $('#form_college_courses_fees').validate({
      rules:{
        _course:{
          valueNotEquals:'0'
        },
        course_duration:{
          valueNotEquals:'0'
        },
        course_duration_type:{
          valueNotEquals:'0'
        },
        course_type:{
          valueNotEquals:'0'
        },
        course_pass_type:{
          valueNotEquals:'0'
        }
      },
      messages:{
        _course:{
          valueNotEquals:'Select course'
        },
        course_duration:{
          valueNotEquals:'Select duration'
        },
        course_duration_type:{
          valueNotEquals:'Select duration type'
        },
        course_type:{
          valueNotEquals:'Select course type'
        },
        course_pass_type:{
          valueNotEquals:'Select pass type'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/courses_add',
          data:new FormData($('#form_college_courses_fees')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
           $('#btn_save_course').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_course').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              var table=$('#college_courses_fees_list_table').DataTable();
              table.ajax.reload( null, false );
              if(f.redirect){
                window.location.href=f.redirect;
              }
              //$('#form_college_faculty').find('#college_gallery_image').val(null);
              //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
            }else if(f.error){
              $('#btn_save_course').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_course').html('Save').prop('disabled',false);
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

    $('#form_college_courses_fees_intro').validate({
      rules:{
        college_general_info:{
          required:true
        }
      },
      messages:{
        college_general_info:{
          required:'Enter information'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/info_add',
          data:$('#form_college_courses_fees_intro').serialize(),
          beforeSend:function(){
            $('#btn_save_course_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_course_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              if(f.redirect){
                window.location.href=f.redirect;
              }
              //$('#form_college_faculty').find('#college_gallery_image').val(null);
              //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
            }else if(f.error){
              $('#btn_save_course_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_course_info').html('Save').prop('disabled',false);
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

    if($('#college_general_info').length>0){
      //tiny_mce('#college_general_info');
      jodit('#college_general_info');
      //var college_general_info_editor = new FroalaEditor('.college_general_info');
    }

    // $('#form_college_admission_intro').validate({
    //   rules:{
    //     college_general_info:{
    //       required:true
    //     }
    //   },
    //   messages:{
    //     college_general_info:{
    //       required:'Enter information'
    //     }
    //   },
    //   submitHandler:function(){
    //     $.ajax({
    //       type:'POST',
    //       url:base_url+'/institutions/colleges/info_add',
    //       data:$('#form_college_admission_intro').serialize(),
    //       beforeSend:function(){
    //         $('#btn_save_admission_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
    //       },
    //       success:function(f){
    //         if(f.success){
    //           $('#btn_save_admission_info').html('Save Data').prop('disabled',false);
    //           Swal.fire({
    //             icon: 'success',
    //             title: f.success,
    //             confirmButtonText:'Close',
    //             confirmButtonColor:'#69da68',
    //             allowOutsideClick: false,
    //           });
    //           if(f.redirect){
    //             window.location.href=f.redirect;
    //           }
    //           //$('#form_college_faculty').find('#college_gallery_image').val(null);
    //           //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
    //         }else if(f.error){
    //           $('#btn_save_admission_info').html('Save Data').prop('disabled',false);
    //           Swal.fire({
    //             icon: 'error',
    //             title: f.error,
    //             confirmButtonText:'Close',
    //             confirmButtonColor:'#69da68',
    //             allowOutsideClick: false,
    //           });
    //         }else if(f.redirect){
    //           $('#btn_save_admission_info').html('Save Data').prop('disabled',false);
    //           Swal.fire({
    //             icon: 'info',
    //             title: 'Your session expired',
    //             confirmButtonText:'Close',
    //             confirmButtonColor:'#69da68',
    //             allowOutsideClick: false,
    //           });
    //         }
    //       }
    //     });
    //   }
    // });

    $('#form_college_cutoff_intro').validate({
      rules:{
        college_general_info:{
          required:true
        }
      },
      messages:{
        college_general_info:{
          required:'Enter information'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/info_add',
          data:$('#form_college_cutoff_intro').serialize(),
          beforeSend:function(){
            $('#btn_save_cutoff_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_cutoff_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              if(f.redirect){
                window.location.href=f.redirect;
              }
              //$('#form_college_faculty').find('#college_gallery_image').val(null);
              //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
            }else if(f.error){
              $('#btn_save_cutoff_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_cutoff_info').html('Save').prop('disabled',false);
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


    $('#form_college_placement_intro').validate({
      rules:{
        college_general_info:{
          required:true
        }
      },
      messages:{
        college_general_info:{
          required:'Enter information'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/info_add',
          data:$('#form_college_placement_intro').serialize(),
          beforeSend:function(){
            $('#btn_save_placement_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_placement_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              if(f.redirect){
                window.location.href=f.redirect;
              }
              //$('#form_college_faculty').find('#college_gallery_image').val(null);
              //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
            }else if(f.error){
              $('#btn_save_placement_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_placement_info').html('Save').prop('disabled',false);
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

    $('#form_college_scholar_intro').validate({
      rules:{
        college_general_info:{
          required:true
        }
      },
      messages:{
        college_general_info:{
          required:'Enter information'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/info_add',
          data:$('#form_college_scholar_intro').serialize(),
          beforeSend:function(){
            $('#btn_save_scholar_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_scholar_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              if(f.redirect){
                window.location.href=f.redirect;
              }
              //$('#form_college_faculty').find('#college_gallery_image').val(null);
              //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
            }else if(f.error){
              $('#btn_save_scholar_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_scholar_info').html('Save').prop('disabled',false);
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

    $('#form_college_faculty_intro').validate({
      rules:{
        college_general_info:{
          required:true
        }
      },
      messages:{
        college_general_info:{
          required:'Enter information'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/info_add',
          data:$('#form_college_faculty_intro').serialize(),
          beforeSend:function(){
            $('#btn_save_faculty_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_faculty_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              if(f.redirect){
                window.location.href=f.redirect;
              }
              //$('#form_college_faculty').find('#college_gallery_image').val(null);
              //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
            }else if(f.error){
              $('#btn_save_faculty_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_faculty_info').html('Save').prop('disabled',false);
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

    $('body').on('click','.btn_del_ucourse',function(){
      var _course=$(this).attr('data-ucid');

      Swal.fire({
        title: "Do you want to delete the Course data?",
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#69da68',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value){
          $.ajax({
            type:'POST',
            url:base_url+'/institutions/colleges/courses_delete',
            data:{_college:_college,_course:_course,csrf_test_name:csrf_hash},
            beforeSend:function(){

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
                var table=$('#college_courses_fees_list_table').DataTable();
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
            }
          });
        }
      });
    });

    //Courses


    //Hostel

    $('body').on('click','#hostel_details_type_general_women',function(){
      var v=$(this).val();

      if(v=='1'){
        $('#form_hostel_settings_women_general_div').css('display','block');
        $('#form_hostel_settings_women_specific_div').css('display','none');
      }else if(v=='2'){
        $('#form_hostel_settings_women_general_div').css('display','none');
        $('#form_hostel_settings_women_specific_div').css('display','block');
      }
    });

    $('body').on('click','#hostel_details_type_specific_women',function(){
      var v=$(this).val();

      if(v=='1'){
        $('#form_hostel_settings_women_general_div').css('display','block');
        $('#form_hostel_settings_women_specific_div').css('display','none');
      }else if(v=='2'){
        $('#form_hostel_settings_women_general_div').css('display','none');
        $('#form_hostel_settings_women_specific_div').css('display','block');
      }
    });

    $('body').on('click','#hostel_details_type_specific_men',function(){
      var v=$(this).val();

      if(v=='1'){
        $('#form_hostel_settings_men_general_div').css('display','block');
        $('#form_hostel_settings_men_specific_div').css('display','none');
      }else if(v=='2'){
        $('#form_hostel_settings_men_general_div').css('display','none');
        $('#form_hostel_settings_men_specific_div').css('display','block');
      }
    });

    $('body').on('click','#hostel_details_type_general_men',function(){
      var v=$(this).val();

      if(v=='1'){
        $('#form_hostel_settings_men_general_div').css('display','block');
        $('#form_hostel_settings_men_specific_div').css('display','none');
      }else if(v=='2'){
        $('#form_hostel_settings_men_general_div').css('display','none');
        $('#form_hostel_settings_men_specific_div').css('display','block');
      }
    });

    $('#form_college_hostel_men').validate({

      submitHandler:function(f){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/hostel_add',
          data:$('#form_college_hostel_men').serialize(),
          beforeSend:function(){
            $('#btn_save_form_hostel_men').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_form_hostel_men').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });          
            }else if(f.error){
              $('#btn_save_form_hostel_men').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_form_hostel_men').html('Save').prop('disabled',false);
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

    $('#form_college_hostel_women').validate({

      submitHandler:function(f){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/hostel_add',
          data:$('#form_college_hostel_women').serialize(),
          beforeSend:function(){
            $('#btn_save_form_hostel_women').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_form_hostel_women').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });          
            }else if(f.error){
              $('#btn_save_form_hostel_women').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_form_hostel_women').html('Save').prop('disabled',false);
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


    var row=0;

    $('body').on('click','#btn_add_hostel_men_row',function(){
      var html='';

      html+='<tr id="tr' + row + '">';
      html+='<td>';
      html+='<input type="text" class="form-control" name="hostel['+row+'][name]" aria-describedby="hostel_name" placeholder="Name of the Residence" value="">';
      html+='</td>';
      html+='<td>';
      html+='<input type="text" class="form-control" name="hostel['+row+'][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="">';
      html+='</td>';
      html+='<td>';
      html+='<input type="text" class="form-control" name="hostel['+row+'][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="Non AC Rooms Charges(Per Annum)" value="">';
      html+='</td>';
      html+='<td>';
      html+='<input type="text" class="form-control" name="hostel['+row+'][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="AC Rooms Charges(Per Annum)" value="">';
      html+='</td>';
      html+='</td>';
      html+='<td>';
      html+='<button type="button" class="btn btn-sm btn-danger" onclick="$(\'#tr' + row + '\').remove()"><i class="fa fa-minus"></i></button>';
      html+='</td>';
      html+='</tr>';

      $('#form_college_hostel_men tbody').append(html);

      row++;
    });

    var row2=0;

    $('body').on('click','#btn_add_hostel_row_women',function(){
      var html='';

      html+='<tr id="trw' + row2 + '">';
      html+='<td>';
      html+='<input type="text" class="form-control" name="hostel['+row2+'][name]" aria-describedby="hostel_name" placeholder="Name of the Residence" value="">';
      html+='</td>';
      html+='<td>';
      html+='<input type="text" class="form-control" name="hostel['+row2+'][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="">';
      html+='</td>';
      html+='<td>';
      html+='<input type="text" class="form-control" name="hostel['+row2+'][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="Non AC Rooms Charges(Per Annum)" value="">';
      html+='</td>';
      html+='<td>';
      html+='<input type="text" class="form-control" name="hostel['+row2+'][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="AC Rooms Charges(Per Annum)" value="">';
      html+='</td>';
      html+='</td>';
      html+='<td>';
      html+='<button type="button" class="btn btn-sm btn-danger" onclick="$(\'#trw' + row2 + '\').remove()"><i class="fa fa-minus"></i></button>';
      html+='</td>';
      html+='</tr>';

      $('#form_college_hostel_women tbody').append(html);

      row2++;
    });

    //Hostel


    //Info
    $('#form_college_info').validate({
      rules:{
        college_general_info:{
          required:true
        }
      },
      messages:{
        college_general_info:{
          required:'Enter information'
        }
      },
      submitHandler:function(){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/info_add',
          data:$('#form_college_info').serialize(),
          beforeSend:function(){
            $('#btn_save_college_general_info').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
              $('#btn_save_college_general_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              var table=$('#college_faculties_list_table').DataTable();
              table.ajax.reload( null, false );
              if(f.redirect){
                window.location.href=f.redirect;
              }
              //$('#form_college_faculty').find('#college_gallery_image').val(null);
              //$('#form_college_faculty').find('#college_gallery_category').val('0').trigger('change');           
            }else if(f.error){
              $('#btn_save_college_general_info').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_college_faculty').html('Save').prop('disabled',false);
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

    //Info


  }

  

 $("#course_streams").chosen({no_results_text: "Select Streams"});
 $("#course_sub_streams").chosen({no_results_text: "Select Sub Streams"});
 $("#course_news").chosen({no_results_text: "Select News by Title"});
 $("#course_exams").chosen({no_results_text: "Select Exams"});

 $("#college_country").chosen({no_results_text: "Select Country"});
 $("#college_state").chosen({no_results_text: "Select State"});
 $("#college_district").chosen({no_results_text: "Select District"});
 $("#college_city").chosen({no_results_text: "Select City"});
 $("#college_university").chosen({no_results_text: "Select University"});
 $("#college_course").chosen({no_results_text: "Select Course"});
 $("#college_courses").chosen({no_results_text: "Select Course"});
 $("#college_faculty_qualifications").chosen({no_results_text: "Select Qualification"});
 $("#college_faculty_subjects").chosen({no_results_text: "Select Subjects"});


  $('#college_menu_widgets_section').on('change', function(evt, params) {
    var selected_v=$('#college_menu_widgets_section option:selected').val();
    alert(selected_v);
    $('#selected_widgets').append(selected_v);
  });

  $('body').on('paste keyup focusout','#college_name,#college_email,#college_phone',function(){
    $.ajax({
      url:base_url+'/institutions/colleges/check_college',
      type:'POST',
      data:{
        college_name:$('#form_college').find('#college_name').val(),
        college_country:$('#form_college').find('#college_country').val(),
        college_state:$('#form_college').find('#college_state').val(),
        college_city:$('#form_college').find('#college_city').val(),
        college_university:$('#form_college').find('#college_university').val(),
        csrf_test_name:csrf_hash
      },
      success:function(d){
        if(d.error){
          Swal.fire({
            icon: 'error',
            title: d.error,
            confirmButtonText:'Close',
            confirmButtonColor:'#69da68',
            allowOutsideClick: false,
          });
          $('#btn_save_college').css('display','none');
        }else{
          $('#btn_save_college').css('display','block');
        }
      }
    });
  });

  $("#course_news").chosen().change(function(){
    var selected=$(this).val();
    if(selected!=''){
      $('#btn_add_news_to_college').prop('disabled',false);
    }else{
      $('#btn_add_news_to_college').prop('disabled',true);
    }
  });


  $('body').on('click','.btn_news_add',function(){
    var cid=$(this).attr('data-college');
    var country=$(this).attr('data-country');
    var news_type=$(this).attr('data-news_type');
    var html='';

    $.ajax({
      type:'POST',
      url:base_url+'/news/load_news',
      data:{csrf_test_name:csrf_hash,cid:cid,country:country,news_type:news_type},
      success:function(d){
        if(d!=''){
          $.each(d,function(i,v){
            html+='<option value="'+v.news_id+'" '+v.selected+'>'+v.news_title+'</option>';
          });          
        }

        $('#course_news').html(html);
        $("#course_news").trigger("chosen:updated");

        $('#collegeNewswModal').find('#cid').val(cid);

        
      }
    });
  });


  $('#form_college_news').validate({
    submitHandler:function(){
      $.ajax({
        type:'POST',
        url:base_url+'/news/tag_news',
        data:$('#form_college_news').serialize(),
        beforeSend:function(){
          $('#btn_add_news_to_college').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
        },
        success:function(d){
          if(d.success){
            $('#btn_add_news_to_college').prop('disabled',true).html('Update');
             Swal.fire({
                icon: 'success',
                title: d.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
             $('#course_news').html('');
             $("#course_news").trigger("chosen:updated");
             $('#collegeNewswModal').modal('hide');
          }else{
            $('#btn_add_news_to_college').prop('disabled',true).html('Update');
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
          var table=$('#college_list_table').DataTable();
          table.ajax.reload( null, false ); 
        }
      });
    }
  });

  if($('#college_placement_info').length>0){
    jodit('#college_placement_info');
  }

  if($('#college_about_info').length>0){
    jodit('#college_about_info');
  }
    


  $('#form_college').validate({
    rules:{
      college_state:{
        valueNotEquals: "0" 
      },
      college_city:{
        valueNotEquals: "0" 
      },
      college_name:{
        required:true
      },
      college_email:{
        required:false,
        email:true
      },
      college_phone:{
        required:false
      },
      college_estd:{
        required:true,
        digits: true,
        minlength:4,
        maxlength:4
      },
      college_type:{
        valueNotEquals: "0"
      },
      college_university:{
        valueNotEquals: "0" 
      },
      college_youtube_video_link:{
        required:false
      },
      college_logo:{
        required:false,
        extension: "jpeg|jpg|png|webp",
        maxFileSize: {
            "unit": "KB",
            "size": "200"
        },
        minFileSize: {
            "unit": "KB",
            "size": "0.50"
        }
      },
      college_banner:{
        required:false,
        extension: "jpeg|jpg|png|webp",
        maxFileSize: {
            "unit": "KB",
            "size": "1100"
        },
        minFileSize: {
            "unit": "KB",
            "size": "0.50"
        }
      }
    },
    messages:{
      college_state:{
        valueNotEquals: "Please select state" 
      },
      college_city:{
        valueNotEquals: "Please select city" 
      },
      college_name:{
        required:"Please enter college name"
      },
      college_email:{
        email:"Email address is not valid"
      },
      college_phone:{
        required:"Please enter college Phone No."
      },
      college_estd:{
        required:"Please enter Estd. year",
        digits: "Only numeric value allowed",
        minlength:"Estd. Year must be 4 digit long",
        maxlength:"Estd. Year must be 4 digit long",
      },
      college_type:{
        valueNotEquals: "Please enter college type"
      },
      college_university:{
        valueNotEquals: "Please select University" 
      },
      college_logo:{
        extension: "Allowed file types are jpeg,jpg,png,webp"
      },
      college_banner:{
        extension: "Allowed file types are jpeg,jpg,png,webp"
      }
    },
    submitHandler:function(){

      var formData=new FormData($('#form_college')[0]);
      // formData.append('college_ranking_info',tinymce.get('college_ranking_info').getContent());
      // formData.append('college_placement_info',tinymce.get('college_placement_info').getContent());
      // formData.append('college_facilities_info',tinymce.get('college_facilities_info').getContent());
      // formData.append('college_general_info',tinymce.get('college_general_info').getContent());

      // formData.append('college_about_info',tinymce.get('college_about_info').getContent());

      
      $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/save_college',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_save_college').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_save_college').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              }); 
              window.location.reload();          
            }else if(f.error){
              $('#btn_save_college').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_college').prop('disabled',true);
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
            $('#btn_save_college').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('#form_college_quick_upload').validate({
    rules:{
      college_name:{
        required:true
      },
      college_email:{
        required:false,
        email:true
      },
      college_phone:{
        required:false
      },
      college_estd:{
        required:true,
        digits: true,
        minlength:4,
        maxlength:4
      },
      college_logo:{
        required:false,
        extension: "jpeg|jpg|png",
        maxFileSize: {
            "unit": "KB",
            "size": "200"
        },
        minFileSize: {
            "unit": "KB",
            "size": "0.50"
        }
      },
      college_banner:{
        required:false,
        extension: "jpeg|jpg|png",
        maxFileSize: {
            "unit": "KB",
            "size": "900"
        },
        minFileSize: {
            "unit": "KB",
            "size": "0.50"
        }
      },
      college_leads_per_day:{
        required:false,
        digits: true
      },
      college_leads_max:{
        required:false,
        digits: true
      }
    },
    messages:{
      college_name:{
        required:"Please enter college name"
      },
      college_email:{
        email:"Email address is not valid"
      },
      college_phone:{
        required:"Please enter college Phone No."
      },
      college_estd:{
        required:"Please enter Estd. year",
        digits: "Only numeric value allowed",
        minlength:"Estd. Year must be 4 digit long",
        maxlength:"Estd. Year must be 4 digit long",
      },
      college_logo:{
        extension: "Allowed file types are jpeg,jpg,png"
      },
      college_banner:{
        extension: "Allowed file types are jpeg,jpg,png"
      }
    },
    submitHandler:function(){
      $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/save_college_quick',
          data:new FormData($('#form_college_quick_upload')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_college_quick').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_update_college_quick').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });  
             var table=$('#college_list_table').DataTable();
              table.ajax.reload( null, false );          
            }else if(f.error){
              $('#btn_update_college_quick').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_update_college_quick').prop('disabled',true);
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
            $('#form_college_quick_upload')[0].reset();
            $('#btn_update_college_quick').html('Update').attr('disabled',false);
            $('#collegeQuickUpdateModal').modal('hide');
          },
          resetForm: true 
      });
    }
  });


  $('#form_college_broucher_upload').validate({
    rules:{
      college_file: {
          required: true,
          extension: "jpeg|jpg|png"
      },
      collge_broucher_type:{
        valueNotEquals:'0'
      }
    },
    messages:{
      college_file: {
          required: 'Select file please',
          extension: "Only allowed extensions are jpeg|jpg|png"
      },
      collge_broucher_type:{
        valueNotEquals:'Select broucher type'
      }
    },
    submitHandler:function(){
      $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/save_college_files',
          data:new FormData($('#form_college_broucher_upload')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_college_broucher').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            $('#browse_btn').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_update_college_broucher').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });           
            }else if(f.error){
              $('#btn_update_college_broucher').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_update_college_broucher').prop('disabled',true);
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
            $('#btn_update_college_broucher').html('Update').attr('disabled',false);
            $('#browse_btn').prop('disabled',false);
            var table=$('#broucher_list_table').DataTable();
            table.ajax.reload( null, false ); 
          },
          resetForm: true 
      });
    }
  });

  $('body').on('click','.btn_del_college_file',function(){
    var cid=$(this).attr('data-cid');
    var aid=$(this).attr('data-aid');
    var file_type=$(this).attr('data-file_type');

    Swal.fire({
      title: "Do you want to delete the file?",
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#69da68',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/delete_college_files',
          data:{cid:cid,aid:aid,file_type:file_type,[csrf_name]:csrf_hash},
          beforeSend:function(){

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
              var table=$('#broucher_list_table').DataTable();
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
          }
        });
      }
    });

  });

  $('#form_college_excel').validate({
    rules: {
      college_excel: {
        required: true        
      }
    },
    messages: {
      college_excel: {
        required: 'Select excel file'
      }
    },
    submitHandler:function(){
      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/import_college',
        data:new FormData($('#form_college_excel')[0]),
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        target: '.preview',
        beforeSend:function(){
            $('#btn_import_college').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_import_college').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              var table=$('#college_list_table').DataTable();
              table.ajax.reload( null, false );
              $('#form_college_excel').trigger("reset");
              $('#collegeImportModal').modal('hide');         
            }else if(f.error){
              $('#btn_import_college').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_import_college').prop('disabled',true);
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
            $('#btn_import_college').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('body').on('click','.btn_review_writing',function(){
    $('#form_inst_review_upload').find('#_inst_id').val($(this).attr('data-college'));
    $('#collegeReviewModal').find('#collegeReviewModalTitle').html('Add Review for '+$(this).attr('data-college_name'));
    var inst_id=$(this).attr('data-college');
    $.ajax({
      type:'POST',
      url:base_url+'/institutions/load_review',
      data:{[csrf_name]:csrf_hash,inst_id:inst_id,anonymus_id:anonymus_id},
      success:function(d){
        $('#collegeReviewModal').find('.modal-body').html(d.html);
      }
    });
  });


  $('body').on('click','#btn_export_search_data',function(){
    $.ajax({
      type:'POST',
      url:base_url+'/institutions/colleges/export_to_search',
      data:{csrf_test_name:csrf_hash},
      beforeSend:function(){
        $('#btn_export_search_data').prop('disabled',true).html('Exporting...');
      },
      success:function(d){
        if(d.success){
          alert(d.success);
        }else{
          alert(d.error);
        }

       
      },
      complete:function(xhr,status){
         $('#btn_export_search_data').prop('disabled',false).html('Export');
      }
    });
  });


  $( "#collegeReviewModal" ).on('shown', function(){

  });



  $('#form_inst_review_upload').validate({
    rules:{
      review_detail_placement:{
        required:true,
        minlength:45
      },
      review_detail_interview:{
        required:true,
        minlength:45
      },
      review_detail_internship:{
        required:true,
        minlength:45
      },
      review_detail_college:{
        required:true,
        minlength:45
      },
      review_detail_campus:{
        required:true,
        minlength:45
      },
      review_detail_social:{
        required:true,
        minlength:45
      },
      review_detail_hostel:{
        required:true,
        minlength:45
      },
      review_detail_courses:{
        required:true,
        minlength:45
      },
      review_detail_faculty:{
        required:true,
        minlength:45
      }
    },
    messages:{
      review_detail_placement:{
        required:'Please enter detailed review',
      }
    },
    submitHandler:function(){
      $.ajax({
        type:'POST',
        url:base_url+'/institutions/save_review',
        data:$('#form_inst_review_upload').serialize(),
        beforeSend:function(){
          $('#btn_update_review').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
            $('#form_inst_review_upload')[0].reset();
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
        complete:function(status,xhr){
          $('#btn_update_review').html('Submit').attr('disabled',false);
          $('#collegeReviewModal').modal('hide');
        }
      });
    }
  });


  $('#form_college_excel_2').validate({
    rules: {
      college_excel: {
        required: true,
        extension: "xlsx",
        maxFileSize: {
            "unit": "KB",
            "size": "10000"
        },
        minFileSize: {
            "unit": "KB",
            "size": "5"
        }       
      },
      country_states:{
        valueNotEquals:"0"
      },
      country_universities:{
        valueNotEquals:"0"
      }
    },
    messages: {
      college_excel: {
        required: 'Select excel file'
      },
      country_states:{
        valueNotEquals:"Select state"
      },
      country_universities:{
        valueNotEquals:"Select university"
      }
    },
    submitHandler:function(){
      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/import_college_data_preview',
        data:new FormData($('#form_college_excel_2')[0]),
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        target: '.preview',
        beforeSend:function(){
            $('#btn_import_college_data_preview').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.html==''){
              $('#btn_import_college_data_preview').prop('disabled',false);
              $('#btn_import_college_data_preview').css('display','none');
              $('#btn_import_college').css('display','block');
              $.ajax({
                type:'POST',
                url:base_url+'/institutions/colleges/import_college_2',
                data:new FormData($('#form_college_excel_2')[0]),
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000000,
                target: '.preview',
                beforeSend:function(){
                  $('#btn_import_college').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
                },
                success:function(d){
                  if(d.success){
                   $('#btn_import_college').prop('disabled',true);
                   Swal.fire({
                      icon: 'success',
                      title: d.success,
                      confirmButtonText:'Close',
                      confirmButtonColor:'#69da68',
                      allowOutsideClick: false,
                    });
                    var table=$('#college_list_table').DataTable();
                    table.ajax.reload( null, false );
                    $('#form_college_excel_2').trigger("reset");
                    $('#collegeImportModal').modal('hide');         
                  }else if(d.error){
                    $('#btn_import_college').prop('disabled',true);
                    Swal.fire({
                      icon: 'error',
                      title: d.error,
                      confirmButtonText:'Close',
                      confirmButtonColor:'#69da68',
                      allowOutsideClick: false,
                    });
                  }else if(d.redirect){
                    $('#btn_import_college').prop('disabled',true);
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
                  $('#btn_import_college').html('Upload').attr('disabled',false);
                },
                resetForm: true 
              });
                     
            }else if(f.html!=''){
              $('#btn_import_college_data_preview').prop('disabled',false);
              $('#btn_import_college_data_preview').css('display','block');
              $('#btn_import_college').css('display','none');

              $('#collegeImportPreviewModal').find('.modal-body').html(f.html);
              $('#collegeImportPreviewModal').modal('show');

            }else if(f.redirect){
              $('#btn_import_college_data_preview').prop('disabled',true);
              $('#btn_import_college').prop('disabled',true);
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
            $('#btn_import_college_data_preview').html('Upload').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });

  $('body').on('change','#college_country',function(){
    let country=$('#college_country :selected').val();

    let f_data  =   new Array(country);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_states',
      data:{ctext:ctext,listing_type:'1',csrf_test_name:csrf_hash},
      success:function(d){
        $('#college_state').html(d.html);
        $("#college_state").trigger("chosen:updated");
      }
    });
    load_university(country,'0','0');
    load_statuetorybodies(country);
  });

  $('body').on('change','#country_states',function(){
    var state_id=$('#country_states :selected').val();
    load_university(country,state_id,'0');
  });

  $('body').on('change','#college_state',function(){
    let country = $('#college_country :selected').val();
    let state   = $('#college_state :selected').val();
    let city    = $('#college_city :selected').val();
    let f_data  =   new Array(country,state);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_cities',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#college_city').html(d.html);
        $("#college_city").trigger("chosen:updated");
      }
    });
   // load_university(country,state,city);
    load_districts(country,state);
  });

  $('body').on('change','#college_city',function(){
    let country = $('#college_country :selected').val();
    let state   = $('#college_state :selected').val();
    let city    = $('#college_city :selected').val();
    // load_university(country,state,city);
  });


  $('body').on('click','.btn_del_college',function(){
    let _college=$(this).attr('data-aid');
    let _college_id=$(this).attr('data-aidp');

    Swal.fire({
      title: "Do you want to delete the College?",
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#69da68',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/colleges/delete_college',
          data:{_college:_college,_college_id:_college_id,csrf_test_name:csrf_hash},
          beforeSend:function(){

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
              var table=$('#college_list_table').DataTable();
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
          }
        });
      }
    });
  });


  $('body').on('click','.btn_update_college_course_data',function(){
    let _college_id=$(this).attr('data-college_id');

    Swal.fire({
      title: "Do you want to update the data?",
      text: "You can revert this later!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#69da68',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/_update_user_stream_data',
          data:{_college_id:_college_id,csrf_test_name:csrf_hash},
          beforeSend:function(){
            let timerInterval;
            Swal.fire({
              title: "Wait! Updating Data",
              html: "",
              showCancelButton: false,
              showOkButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              var table=$('#college_list_table').DataTable();
              table.ajax.reload( null, false );
            });
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
          }
        });
      }
    });
  });


  $('body').on('click','.btn_create_college_user',function(){
    let _college_id=$(this).attr('data-college_id');
    let college_user_id=$(this).data('data-user_id');

    Swal.fire({
      title: "Do you want to update the data?",
      text: "You can revert this later!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#69da68',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/_update_user_data',
          data:{college_id:_college_id,college_user_id:college_user_id,csrf_test_name:csrf_hash},
          beforeSend:function(){
            let timerInterval;
            Swal.fire({
              title: "Wait! Updating Data",
              html: "",
              showCancelButton: false,
              showOkButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              var table=$('#college_list_table').DataTable();
              table.ajax.reload( null, false );
            });
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
          }
        });
      }
    });
  });




  $('body').on('click','.btn_update_college_logo_banner_data',function(){
    let _college_id=$(this).attr('data-college_id');

    Swal.fire({
      title: "Do you want to update the data?",
      text: "You can revert this later!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#69da68',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/_update_user_images',
          data:{_college_id:_college_id,csrf_test_name:csrf_hash},
          beforeSend:function(){
            let timerInterval;
            Swal.fire({
              title: "Wait! Updating Data",
              html: "",
              showCancelButton: false,
              showOkButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              var table=$('#college_list_table').DataTable();
              table.ajax.reload( null, false );
            });
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

              window.open(d.redirect, '_blank');
              
            }else{
              Swal.fire({
                icon: 'error',
                title: d.error,
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

  $('body').on('click','.btn_dele_rank',function(){
    let _college_id=$(this).attr('data-college_id');
    let _ranking_id=$(this).attr('data-rank_id');
    let _rank_row=$(this).data('rank_row');

    Swal.fire({
      title: "Do you want to delete the data?",
      text: "You can revert this later!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#69da68',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/_delete_college_rank',
          data:{college_id:_college_id,ranking_id:_ranking_id,csrf_test_name:csrf_hash},
          beforeSend:function(){
            let timerInterval;
            Swal.fire({
              title: "Wait! Updating Data",
              html: "",
              showCancelButton: false,
              showOkButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              
            });
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

              $('#tr'+_rank_row).remove();
              
            }else{
              Swal.fire({
                icon: 'error',
                title: d.error,
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




  $('body').on('click','.btn_update_url_cache',function(e){
    let cache_url=$(this).attr('data-college_url');

    Swal.fire({
      title: "Do you want to update the cache?",
      text: "Updating cache will drop page performance.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#69da68',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/_delete_cache',
          data:{cache_type:'college_url_cache',cache_url:cache_url,[csrf_name]:csrf_hash},
          beforeSend:function(){
            let timerInterval;
            Swal.fire({
              title: "Wait! Updating cache",
              html: "",
              showCancelButton: false,
              showOkButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                  timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              
            });
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

              //window.open(d.redirect, '_blank');
              
            }else{
              Swal.fire({
                icon: 'error',
                title: d.error,
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








  if(_ur=='5'){
    $('#notesModal').modal('show');
  }

  $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });
  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  });


  $('body').on('click','.btn_create_slug',function(){
    var data_value_id=$(this).attr('data-value_id');
    var data_type=$(this).attr('data-type')
    $.ajax({
      type:'POST',
      url:base_url+'/institutions/save_slug',
      data:{csrf_test_name:csrf_hash,data_value_id:data_value_id,data_type:data_type},
      beforeSend:function(){
          $(this).prop('disabled',true);
          $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        if(d.success){
          var table=$('#college_list_table').DataTable();
          table.ajax.reload( null, false );          
        }
      }
    });
  });


  $('body').on('click','#btn_add_cutoff',function(){
    var cutoffhtml='';

    cutoffhtml+='<tr style="background-color: #00000017;border-top:1px #0000000f solid;" id="tr'+rowcutoff+'">';
      cutoffhtml+='<td style="width:20%;">';
        cutoffhtml+='<select class="form-control cutoff_selects" name="college_cutoff['+rowcutoff+'][exams]">'+cutoff_exams+'</select>';
      cutoffhtml+='</td>';
      cutoffhtml+='<td style="width:40%;">';
        cutoffhtml+='<select class="form-control cutoff_selects" name="college_cutoff['+rowcutoff+'][courses]">'+cutoff_course+'</select>';
      cutoffhtml+='</td>';
      cutoffhtml+='<td style="width:10%;">';
        cutoffhtml+='<select class="form-control cutoff_selects" name="college_cutoff['+rowcutoff+'][year]">'+cutoff_year+'</select>';
      cutoffhtml+='</td>';
      cutoffhtml+='<td style="width:10%;">';
        cutoffhtml+='<select class="form-control cutoff_selects" name="college_cutoff['+rowcutoff+'][rounds]">'+cutoff_round+'</select>';
      cutoffhtml+='</td>';
      
    cutoffhtml+='</tr>';
    cutoffhtml+='<tr style="background-color: #00000017;border-top:1px #0000000f solid;" id="tr_'+rowcutoff+'">';
      cutoffhtml+='<td style="width:20%;">';
        cutoffhtml+='<select class="form-control cutoff_selects" name="college_cutoff['+rowcutoff+'][categories]">'+sub_categories+'</select>';
      cutoffhtml+='</td>';
      cutoffhtml+='<td style="width:40%;">';
        cutoffhtml+='<select class="form-control cutoff_selects" name="college_cutoff['+rowcutoff+'][sub_categories]">'+sub_categories+'</select>';
      cutoffhtml+='</td>';
      cutoffhtml+='<td style="width:20%;">';
        cutoffhtml+='<input type="text" class="form-control" name="college_cutoff['+rowcutoff+'][value]">';
      cutoffhtml+='</td>';
      cutoffhtml+='<td style="width:20%;"><button type="button" class="btn btn-sm btn-danger" onclick="$(\'#tr' + rowcutoff + '\').remove();$(\'#tr_' + rowcutoff + '\').remove();"><i class="fa fa-minus"></i></button></td>';
    cutoffhtml+='</tr>';

     $('#form_college_cutoff_info tbody').append(cutoffhtml);
     $('.cutoff_selects').chosen();
     // $('.cutoff_selects').trigger("chosen:updated");

      rowcutoff++;

  });

  $('#form_college_cutoff_info').validate({
    submitHandler:function(){
      //console.log($('#form_college_cutoff_info').serialize());
      var postingData = $('#form_college_cutoff_info').serializeArray();
      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/cutoff_add',
        data:postingData,
        beforeSend:function(){
          $('#btn_save_cutoff').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></span>').prop('disabled',true);
        },
        success:function(d){
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
        },complete:function(xhr,status){
          $('#btn_save_cutoff').html('Save').prop('disabled',false);
        }
      });
    }
  });

  // $('body').on('click','#btn_save_cutoff',function(e){
  //   //console.log($('#form_college_cutoff_info').serialize());
  //   var postingData = $('#form_college_cutoff_info').serializeArray();
  //   e.preventDefault();
  //   $.ajax({
  //       type:'POST',
  //       url:base_url+'/institutions/colleges/cutoff_add',
  //       data:postingData,
  //       dataType: 'json',
  //       beforeSend:function(){
  //         //$('#btn_save_cutoff').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></span>').prop('disabled',true);
  //       },
  //       submitHandler:function(d){
  //         if(d.success){
  //           Swal.fire({
  //             icon: 'success',
  //             title: d.success,
  //             confirmButtonText:'Close',
  //             confirmButtonColor:'#d33',
  //             allowOutsideClick: false,
  //           });
  //           $('#btn_save_cutoff').html('Save').prop('disabled',false);
  //         }else if(d.error){
  //           Swal.fire({
  //             icon: 'error',
  //             title: d.error,
  //             confirmButtonText:'Close',
  //             confirmButtonColor:'#d33',
  //             allowOutsideClick: false,
  //           });
  //         }
  //       }
  //     });
  // });

  function ordinal_suffix_of(i) {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
          return i + "st";
      }
      if (j == 2 && k != 12) {
          return i + "nd";
      }
      if (j == 3 && k != 13) {
          return i + "rd";
      }
      return i + "th";
  }

  function load_university(country,state,city){
    let f_data  =   new Array(country,state,city);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_universities',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#college_university').html(d.html);
      }
    });
  }

  function load_districts(country,state){
    let f_data  =   new Array(country,state);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_districts',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#college_district').html(d.html);
      }
    });
  }

  function load_statuetorybodies(country){
    let f_data  =   new Array(country);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_statuetorybodies',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#college_affiliations_div').html(d.html);
      }
    });
  }


  function FileZise(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
  }


  $('body').on('click','.btn_send_email',function(){
    var mail_ids=$(this).attr('data-email');

    $.ajax({
      type:'POST',
      url:base_url+'/webmail_send',
      data:{csrf_test_name:csrf_hash,mail_ids:mail_ids},
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
      }
    });
  });
});

function load_broucher_list_table(college_id,storage_type){
  $('#broucher_list_table').DataTable({ 
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
          "url": base_url+'/institutions/colleges/search_college_broucher_files',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,_college:college_id,storage_type:storage_type}
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

$('body').on('click','.btn_broucher_upload',function(){
  var college_id=$(this).attr('data-college');
  localStorage.setItem('college_id',college_id);
  $('#form_college_broucher_upload').find('#_college_id').val(college_id);
  $('#collegeBroucherUpdateModal').find('.modal-title').html($(this).attr('data-college_name'));
  var html='<option value="0">Select Broucher Type</option>';
  $.ajax({
    type:'POST',
    url:base_url+'/get_broucher_tyeps',
    data:{[csrf_name]:csrf_hash,college_id:college_id},
    success:function(d){
      $.each(d.broucher_types,function(i,v){
        html+='<option value="'+v.broucher_type_id+'">'+v.broucher_type_name+'</option>';
      });

      $('#collegeBroucherUpdateModal').find('#collge_broucher_type').html(html);
    }
  });
});








$( "#collegeBroucherUpdateModal" ).on('shown.bs.modal', function(){
  $('#broucher_list_table').DataTable().destroy();
  var college_id=$('#form_college_broucher_upload').find('#_college_id').val();
  load_broucher_list_table(localStorage.getItem('college_id'),'user_broucher');  
});

    


 var crankr=colleg_ranking_row;

    $(document).on('click','#btn_add_college_ranking_row',function(){
      var rhtml='';

      rhtml+='<tr id="tr' + crankr + '">';
      rhtml+='<td>';
      rhtml+='<select class="form-control" name="college_ranking['+crankr+'][body]">';
      $.each(institute_ranking_bodies,function(i,v){
        rhtml+='<option value="'+v.rank_body_id+'">'+v.rank_body+'</option>';
      });
      rhtml+='<select>';
      rhtml+='</td>';
      rhtml+='<td>';

      rhtml+='<input type="text" name="college_ranking['+crankr+'][years]" value="" placeholder="Enter rank year" class="form-control">';

      rhtml+='</td>';
      rhtml+='<td>';
      rhtml+='<select class="form-control" name="college_ranking['+crankr+'][category]">';
      $.each(institute_ranking_categories,function(i,v){
        rhtml+='<option value="'+v.rank_category_id+'">'+v.rank_category+'</option>';
      });
      rhtml+='<select>';
      rhtml+='</td>';         
      rhtml+='<td>';
      rhtml+='<input type="text" class="form-control" name="college_ranking['+crankr+'][value]" value="0">';
      rhtml+='</td>';
      rhtml+='<td>';
      rhtml+='<select class="form-control" name="college_ranking['+crankr+'][category_value]" id="college_ranking_category_value'+crankr+'">';
      for (i = 100; i <=700; i++) {
        rhtml+='<option value="'+i+'">'+i+'</option>';
      }
      rhtml+='<select>';
      rhtml+='</td>'; 
      rhtml+='<td>';
      rhtml+='<button type="button" class="btn btn-xs btn-danger" onclick="$(\'#tr' + crankr + '\').remove()"><i class="fa fa-minus"></i></button>';
      rhtml+='</td>';
      rhtml+='</tr>';

      $('#form_college_ranking_table tbody').append(rhtml);

      crankr++;
    });


    function create_ranking_value(vid,d){
      var v=vid;
      var vhtml='';

      //alert(vid);

      for (i = 100; i <=700; i++) {
        vhtml+='<option value="'+i+'">'+i+'</option>';
      }

      $('#college_ranking_category_value'+d).html(vhtml);
    }


    function college_info_area(){
      if ($(".college_info").length) {
        //tiny_mce('.college_info');
        jodit('.college_info');
        //var college_info_editor = new FroalaEditor('.college_info');
      }
    }

    if($('#college_hostel_info').length>0){
      jodit('#college_hostel_info');
    }
    


    var cfr=colleg_faq_row;

    $(document).on('click','#btn_add_college_faqus_row',function(){
      var html='';

      html+='<tr id="tr' + cfr + '">';
      html+='<td>';
      html+='<input type="text" class="form-control" name="college_faqus['+cfr+'][ques]" aria-describedby="college_faqus" placeholder="Question" value="">';
    
      html+='<textarea class="form-control college_info" name="college_faqus['+cfr+'][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"></textarea>';
      html+='</td>';
      html+='<td>';
      html+='<div class="btn-group">';
      html+='<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_faqus_row"><i class="fa fa-plus"></i></button>';
      html+='<button type="button" class="btn btn-sm btn-danger" onclick="$(\'#tr' + cfr + '\').remove()"><i class="fa fa-minus"></i></button>';
      html+='</div>';
      html+='</td>';
      html+='</tr>';

      $('#form_college_faqus_table tbody').append(html);

      college_info_area();

      cfr++;
    });


    



    var cfr2=colleg_placement_faq_row;

    $(document).on('click','#btn_add_college_placement_faqus_row',function(){
      var html='';

      html+='<tr id="tr2' + cfr2 + '">';
      html+='<td>';
      html+='<input type="text" class="form-control" name="college_placement_faqs['+cfr2+'][ques]" aria-describedby="college_faqus" placeholder="Question" value="">';
    
      html+='<textarea class="form-control college_info" name="college_placement_faqs['+cfr2+'][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"></textarea>';
      html+='</td>';
      html+='<td>';
      html+='<div class="btn-group">';
      html+='<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_placement_faqus_row"><i class="fa fa-plus"></i></button>';
      html+='<button type="button" class="btn btn-sm btn-danger" onclick="$(\'#tr2' + cfr2 + '\').remove()"><i class="fa fa-minus"></i></button>';
      html+='</div>';
      html+='</td>';
      html+='</tr>';

      $('#form_college_placement_faqus_table tbody').append(html);

      college_info_area();

      cfr2++;
    });


    var cfr3=colleg_scholarship_faq_row;

    $(document).on('click','#btn_add_college_scholarship_faqus_row',function(){
      var html='';

      html+='<tr id="tr3' + cfr3 + '">';
      html+='<td>';
      html+='<input type="text" class="form-control" name="college_scholarship_faqs['+cfr3+'][ques]" aria-describedby="college_faqus" placeholder="Question" value="">';
  
      html+='<textarea class="form-control college_info" name="college_scholarship_faqs['+cfr3+'][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"></textarea>';
      html+='</td>';
      html+='<td>';
      html+='<div class="btn-group">';
      html+='<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_scholarship_faqus_row"><i class="fa fa-plus"></i></button>';
      html+='<button type="button" class="btn btn-xs btn-danger" onclick="$(\'#tr3' + cfr3 + '\').remove()"><i class="fa fa-minus"></i></button>';
      html+='</div>';
      html+='</td>';
      html+='</tr>';

      $('#form_college_scholarship_faqus_table tbody').append(html);

      college_info_area();

      cfr2++;
    });

   $('body').on('click','.btn_menu_quick_update',function(){

      var college_id=$(this).data('college_id');


      //alert(college_id);


      $.ajax({
        type:'POST',
        url:base_url+'/institutions/colleges/searchinnermenues',
        data:{[csrf_name]:csrf_hash,college_id:college_id},
        success:function(d){
          $('#collegeMenuWidgetsModal .modal-body').html(d.html)
        }
      });


    });


   $('body').on('click','.btn_update_menudata',function(){
          alert('hi');
          var menu_id=$(this).data('menu_id');
          $.ajax({
            type:'POST',
            url:base_url+'/institutions/colleges/quickupdateinnermenues',
            data:$('#form_menu_widgets'+menu_id).serialize(),
            success:function(d){
              if(d.success){
                alert(d.success);
              }else{
                alert(d.error);
              }
            }
          });
        });


   $('#form_top_college_add').validate({
    rules:{
      top_college_position:{
        required:true,
        digits:true
      }
    },
    messages:{
      top_college_position:{
        required:''
      }
    },
    submitHandler:function(){
      var college_position=$('#form_top_college_add #top_college_position').val();
      var college_id=$('#form_top_college_add #top_colleges').val();
      top_college_update(college_id,college_position,'new');      
    }
   });


   function top_college_update(college_id,college_position,update_type){
    $.ajax({
      type:'POST',
      url:base_url+'/institutions/_update_college_top_position',
      data:{[csrf_name]:csrf_hash,college_id:college_id,update_type:update_type,college_position:college_position},
      beforeSend:function(){
        if(update_type=='new'){
          $('#btn_add_college_toplist').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></span>').prop('disabled',true);
        }        
      },
      success:function(d){
        if(d.success){
          Swal.fire({
            icon: 'success',
            title: d.success,
            confirmButtonText:'Close',
            confirmButtonColor:'#d33',
            allowOutsideClick: false,
          });

          window.location.reload();
          
        }else if(d.error){
          Swal.fire({
            icon: 'error',
            title: d.error,
            confirmButtonText:'Close',
            confirmButtonColor:'#d33',
            allowOutsideClick: false,
          });
        }
      },complete:function(xhr,status){
        $('#btn_add_college_toplist').html('Add').prop('disabled',false);
      }
    });
   }


   $('body').on('click','.btn_remove_from_top',function(){
    var college_id=$(this).data('college_id');
    top_college_update(college_id,0,'del');
   });

   ytrow=(ytrow>0)?(ytrow+1):1;

   $('body').on('click','#btn_add_yt_video',function(){
    var html='';

    html+='<tr id="ytr'+ytrow+'">'+
            '<td width="90%">'+
              '<div class="row">'+
                '<div class="col-sm-12">'+
                  '<input type="text" class="form-control" id="ytrtext'+ytrow+'" name="ytvideo['+ytrow+'][link]" placeholder="Intro Video" name="college_youtube_video_link" value="" onpaste="onPaseteYTVid('+ytrow+')">'+
                '</div>'+
                '<div class="col-sm-12" id="ytrdiv'+ytrow+'" style="display: none;">'+
                  '<div class="embed-responsive embed-responsive-16by9">'+
                    '<iframe id="ytrframe'+ytrow+'" width="200" height="200" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</td>'+
            '<td width="10%">'+
              '<button class="btn btn-sm btn-danger" type="button" onclick="$(\'#ytr' + ytrow + '\').remove()"><i class="fa fa-trash"></i></button>'+
            '</td>'+
          '</tr>';

      $('#ytr_table').append(html);

      

      ytrow++;
   });


  function onPaseteYTVid(_ytrow){
    var pasteData = event.clipboardData.getData('text');

    if(pasteData!=''){
      $('#ytrdiv' + _ytrow).show();
      $('#ytrframe' + _ytrow).attr('src', pasteData);
    }else{
      $('#ytrdiv' + _ytrow).hide();
      $('#ytrframe' + _ytrow).attr('src', '');
    }
    
  }