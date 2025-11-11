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


   //Tinymce editor
  if ($(".college_info").length) {
    tinymce.init({
      selector: '.college_info',
      entity_encoding : "raw",
      height: 400,
      theme: 'silver',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
      ],
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
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
  
  	$('#agency_list_table').DataTable({ 
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
            "url": base_url+'/settings/ranking-agencies/search',
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


    $('body').on('click','.btn_edit_agency',function(){
    	$('#agenciesModal').find('#_agency').val($(this).attr('data-agency_id'));
    	$('#agenciesModal').find('#agency_name').val($(this).attr('data-agency_name'));
    	$('#agenciesModal').find('#agenciesModalTitle').html('Update '+$(this).attr('data-agency_name'));
    });


    $('#form_agency').validate({
	    rules:{
	      agency_name:{
	        required:true
	      },
	      agency_logo:{
	        required:false,
	        extension: "jpeg|jpg|png",
	        maxFileSize: {
	            "unit": "KB",
	            "size": "100"
	        },
	        minFileSize: {
	            "unit": "KB",
	            "size": "0.50"
	        }
	      }
	    },
	    messages:{
	      agency_name:{
	        required:"Please enter college Phone No."
	      },
	      agency_logo:{
	        extension: "Allowed file types are jpeg,jpg,png"
	      }
	    },
	    submitHandler:function(){
	      $.ajax({
	          type:'POST',
	          url:base_url+'/settings/ranking-agencies/add',
	          data:new FormData($('#form_agency')[0]),
	          cache: false,
	          contentType: false,
	          processData: false,
	          timeout: 60000000,
	          target: '.preview',
	          beforeSend:function(){
	            $('#btn_add_agency').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	          },
	          success:function(f){
	            if(f.success){
	             $('#btn_add_agency').prop('disabled',true);
	             Swal.fire({
	                icon: 'success',
	                title: f.success,
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
	              });  
	              window.location.reload();          
	            }else if(f.error){
	              $('#btn_add_agency').prop('disabled',true);
	              Swal.fire({
	                icon: 'error',
	                title: f.error,
	                confirmButtonText:'Close',
	                confirmButtonColor:'#69da68',
	                allowOutsideClick: false,
	              });
	            }else if(f.redirect){
	              $('#btn_add_agency').prop('disabled',true);
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
	            $('#btn_add_agency').html('Save').attr('disabled',false);
	          },
	          resetForm: true 
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


});