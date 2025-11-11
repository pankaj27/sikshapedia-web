jQuery(function($) {

	jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  	}, "Value must not equal arg.");

  if($('#college_gallery_list_table').length>0){
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
              "data":{[csrf_name]:csrf_hash,_college:_college}
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

  	function load_gallery(_college_id){
		  $('#college_gallery_list_table2').DataTable({ 
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
	            "data":{[csrf_name]:csrf_hash,_college:_college}
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


	  	

  	$('body').on('click','.btn_update_gallery',function(){
  	  var college_id=$(this).attr('data-college');
  	  localStorage.setItem('_college_id',college_id);
  	  $('#collegeGallerUpdateModal').find('#_college_id').val(college_id);
  	  $('#collegeGallerUpdateModal').find('.modal-title').html($(this).attr('data-college_name'));
  	  $('#college_gallery_list_table2').DataTable().destroy();
  	  load_gallery(localStorage.getItem('_college_id'));
  	});

  	$('body').on('change','#college_gallery_category',function(){
	  var se=$('#college_gallery_category :selected').val();

	  if(se=='user_youtube_video_gallery' || se=='user_intro_video'){
	    $('#video_div').css('display','block');
	    $('#file_div').css('display','none');
	  }else{
	    $('#video_div').css('display','none');
	    $('#file_div').css('display','block');
	  }
	});

	$('#form_college_gallery_upload').validate({
      rules:{
        college_gallery_category:{
          valueNotEquals:'0'
        },
        college_gallery_image:{
          required: function() {
            return ($('#college_gallery_category').val() != '0' || $('#college_gallery_category').val() != 'promotional_videos');
          },
          extension: "jpeg|jpg|png|webp",
          maxFileSize: {
              "unit": "KB",
              "size": '500'
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
          data:new FormData($('#form_college_gallery_upload')[0]),
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
              $('#btn_save_form_gallery').html('Update').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              var table=$('#college_gallery_list_table2').DataTable();
              table.ajax.reload( null, false );
              //$('#form_college_gallery_upload').find('#college_gallery_image').val(null);
              //$('#form_college_gallery_upload').find('#college_gallery_category').val('0').trigger('change'); 
              window.location.reload();          
            }else if(f.error){
              $('#btn_save_form_gallery').html('Update').prop('disabled',false);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_form_gallery').html('Update').prop('disabled',false);
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
            $('#btn_save_form_gallery').html('Update').attr('disabled',false);
          },
          resetForm: true 
        });
      }
    });



});