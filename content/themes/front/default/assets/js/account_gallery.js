jQuery(function($) {
  "use strict";

   jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
  	return arg !== value;
  }, "Value must not equal arg.");

  	const Toast = Swal.mixin({
	    toast: true,
	    position: 'top',
	    showConfirmButton: false,
	    timer: 10000
  	});

  	$('#form_gallery_settings').validate({
      rules:{
        gallery_category:{
          valueNotEquals:true
        }
      },
      messages:{
        gallery_category:{
          valueNotEquals:'Please select category first'
        }
      },
      submitHandler:function(d){
        var formData = new FormData($('#form_gallery_settings')[0]);
        formData.append('csrf_test_name', csrf_hash);
        $.ajax({
            type:'POST',
            url:base_url+'updateuniversityaccount',
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            target: '.preview',
            beforeSend:function(){
              $('#btn_update_gallery').html('Uploading started').attr('disabled',true);
            },
            success:function(f){
              if(f.success){
                Toast.fire({
                  icon: 'success',
                  title: f.success
                });
                $('#form_gallery_settings')[0].reset();
                $('#gallery_file_div label').html('Choose File');
                var table=$('#gallery_list_table').DataTable();
            	table.ajax.reload( null, false ); 
              }else if(f.error){
                Toast.fire({
                  icon: 'error',
                  title: f.error
                });
                $('#form_gallery_settings')[0].reset();
              }else if(f.redirect){
                window.location.href=f.redirect;
              }
            },
            xhr: function(){
                //Get XmlHttpRequest object
                 var xhr = $.ajaxSettings.xhr() ;
                //Set onprogress event handler
                 xhr.upload.onprogress = function(data){
                    var perc =(data.loaded / data.total) * 100;
                    $('#btn_update_gallery').html(perc.toFixed(2) + '% Uploaded').attr('disabled',false);
                 };
                 return xhr ;
            },
            error: function (e) {
              Toast.fire({
                icon: 'error',
                title: 'Error Occurred'
              });
            },
            complete:function(status,xhr){
              $('#btn_update_gallery').html('Upload').attr('disabled',true);
            },
            resetForm: true 
          });
      }
  	});

	$('body').on('change','#gallery_category',function(){
	    var gallery_category=$('#gallery_category :selected').val();

	    if(gallery_category=='5'){
	      $('#gallery_youtube_link').css('display','block');
	      $('#gallery_file_div').css('display','none');
	      //$('#btn_update_gallery').prop('disabled',false);    
	    }else{
	      $('#gallery_youtube_link').css('display','none');
	      $('#gallery_file_div').css('display','block');
	      //$('#btn_update_gallery').prop('disabled',false);
	    }
  	});

  	$("#gallery_file").change(function (e) {
      var fileExtension = ['png','jpeg','jpg'];
      checkFile(fileExtension,$(this),300100000,e);
  	});

  	$('#gallery_list_table').DataTable({ 
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
              "url": base_url+'account/gallery/search',
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


    $('body').on('click','.btn_del_gallery_file',function(){
	    var _gallery=$(this).attr('data-aid');

	    $.ajax({
	      type:'POST',
	      url:base_url+'account/gallery/delete',
	      data:{csrf_test_name:csrf_hash,_gallery:_gallery},
	      success:function(d){
	        if(d.success){
	          Toast.fire({
	            icon: 'success',
	            title: d.success
	          });
	          var table=$('#gallery_list_table').DataTable();
	          table.ajax.reload( null, false ); 
	        }else{
	          Toast.fire({
	            icon: 'error',
	            title: d.success
	          });
	        }
	      }
	    });
	});



  	function checkFile(fileExtension,control,file_size,e){
	    if(e.target.files[0].name.match('alert') || e.target.files[0].name.match('onerror')  || e.target.files[0].name.match('onchange') || e.target.files[0].name.match('onclick')){     
	        Toast.fire({
	          icon: 'error',
	          title: "Oops! Invalid File."
	        });

	        window.location.reload();
	        $(this).val(null);
	    }else{
	      if($.inArray(control.val().split('.').pop().toLowerCase(), fileExtension) == -1) {
	        Toast.fire({
	          icon: 'error',
	          title: "Only formats are allowed : "+fileExtension.join(', ')
	        });
	      }else{
	          if(e.target.files[0].size<=file_size){
	            control.next('label.custom-file-label').html(e.target.files[0].name);
	            var gallery_category=$('#gallery_category :selected').val();

			    if(gallery_category==''){
			      $('#btn_update_gallery').prop('disabled',true);    
			    }else{
			      $('#btn_update_gallery').prop('disabled',false);
			    }
	          }else{
	            Toast.fire({
	              icon: 'error',
	              title: 'File size of '+FileZise(e.target.files[0].size)+' is violating the allowed file size of '+FileZise(file_size)
	            });

	            $('#btn_update_gallery').prop('disabled', true);
	          }    
	      }
	    }  
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


});