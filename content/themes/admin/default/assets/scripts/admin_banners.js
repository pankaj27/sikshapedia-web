jQuery(function($) {
  'use strict';


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


      $.validator.addMethod('minImageWidth', function(value, element, params) {
        return ($(element).width || 0) >= params.minWidth;
      }, function(params, element) {
        var imageWidth = $(element).data('imageWidth');
        return (imageWidth!="")
          ? ("Your image's width must be greater than " + params.minWidth + "px")
          : "Selected file is not an image.";
      });

      $.validator.addMethod('minImageHeight', function(value, element, params) {
        return ($(element).data('imageHeight') || 0) >= params.minHeight;
      }, function(params, element) {
        var imageHeight = $(element).data('imageHeight');
        return (imageHeight)
          ? ("Your image's width must be greater than " + params.minHeight + "px")
          : "Selected file is not an image.";
      });





  $.validator.addMethod("valueNotEquals", function(value, element, arg){
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

if ($(".js-example-basic-single").length) {
  $(".js-example-basic-single").select2();
}

  //LInk type
  $('body').on('change','#banner_link_type',function(){
    var link_type=$('#banner_link_type :selected').val();

    if(link_type=='1'){

      $('#banner_link_college_div').css('display','block');

    }else if(link_type=='2'){

       $('#banner_link_college_div').css('display','none');

    }
  });





  //Universities
  $('#banner_list_table').DataTable({ 
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
          "url": base_url+'/settings/banners/search',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,parent_menu:'0'}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
  });


  $('#form_banner_upload').validate({
    rules:{
      banner_image:{
        required:false,
        extension: "jpeg|jpg|webp|png",
        maxFileSize: {
            "unit": "KB",
            "size": "10000"
        },
        minFileSize: {
            "unit": "KB",
            "size": "0.50"
        }
      },
    },
    messages:{
      banner_image:{
        required:"Select a file",
        extension: "Allowed file types are jpeg,jpg,png,webp"
      }
    },
    submitHandler:function(){
      $.ajax({
          type:'POST',
          url:base_url+'/settings/banners/add',
          data:new FormData($('#form_banner_upload')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_update_banner').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_update_banner').prop('disabled',false);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });  
              var table=$('#banner_list_table').DataTable();
              table.ajax.reload( null, false );          
            }else if(f.error){
              $('#btn_update_banner').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_update_banner').prop('disabled',true);
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
            $('#btn_update_banner').html('Save');
            $('#form_banner_upload')[0].reset();
            $('#bannerUploadModal').modal('hide');
          },
          resetForm: true 
      });
    }
  });

  $('body').on('click','.btn_edit_banner',function(){
    let _banner=$(this).attr('data-banner');

    $('#_banner').val(_banner);
    $('#bannerUploadModal').find('#bannerUploadModalTitle').html('Update Banner');
    $('#banner_title').val($(this).attr('data-banner_title'));
    $('#banner_sub_title').val($(this).attr('data-banner_sub_title'));
    $('#banner_link').val($(this).attr('data-banner_link'));
    $('#banner_serial').val($(this).attr('data-serial'));
    $('#banner_img').prop('src',$(this).attr('data-banner_image'));
  });

  $('body').on('click','.btn_del_banner',function(){
    let _banner=$(this).attr('data-bannerid');

    Swal.fire({
      title: "Do you want to delete the Banner?",
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
          url:base_url+'/settings/banners/delete',
          data:{_banner:_banner,csrf_test_name:csrf_hash},
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
              var table=$('#banner_list_table').DataTable();
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

  $('body').on('click','.btn_compress_banner',function(){
    var fid=$(this).attr('data-banner');

    $.ajax({
      type:'POST',
      url:base_url+'/settings/banners/compress',
      data:{csrf_test_name:csrf_hash,fid:fid},
      success:function(d){
        var table=$('#banner_list_table').DataTable();
        table.ajax.reload( null, false );
      }
    });
  });

  $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });
  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  });


});


  var _URL = window.URL || window.webkitURL;
  $("#banner_image").change(function(e) {
    var file, img;


    if ((file = this.files[0])) {
        img = new Image();
        img.onload = function() {
          var w=this.width;
          var h=this.height;

          if(w<1366 && h<500){
            $('#btn_update_banner').prop('disabled',true);
          }else{
            $('#btn_update_banner').prop('disabled',false);
          }

          alert(this.width + " " + this.height);
        };
        img.onerror = function() {
            alert( "not a valid file: " + file.type);
        };
        img.src = _URL.createObjectURL(file);


    }

});