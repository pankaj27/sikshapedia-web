<!-- <link rel="stylesheet" href="https://transloadit.edgly.net/releases/uppy/v1.0.0/uppy.min.css"> -->

<!-- Load Uppy JS bundle. -->
<!-- <script src="https://transloadit.edgly.net/releases/uppy/v1.0.0/uppy.min.js"></script> -->


<link rel="stylesheet" type="text/css" href="<?php echo get_common_url('assets/plugins/jquery.filer-1.3.0/css/jquery.filer.css');?>">
<link rel="stylesheet" type="text/css" href="<?php echo get_common_url('assets/plugins/jquery.filer-1.3.0/css/themes/jquery.filer-dragdropbox-theme.css');?>">
<script type="text/javascript" src="<?php echo get_common_url('assets/plugins/jquery.filer-1.3.0/js/jquery.filer.min.js');?>"></script>




<div class="modal fade bd-example-modal-xl modal-fullscreen" id="specificFileBrowserModal" tabindex="-1" role="dialog" aria-labelledby="specificFileBrowserModal" aria-hidden="true">
	<div class="modal-dialog modal-xl" role="document">
		<div class="modal-content" style="height:100%;">
			<div class="modal-header">
                <h5 class="modal-title" id="uspecificFileBrowserModalTitle">Updload File</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>

            
	        <div class="modal-body">         		

					<form id="form_spec_file_upload" enctype="multipart/form-data">
						<input type="hidden" name="file_spec_upload_parent_folder" id="file_spec_upload_parent_folder" value="">
		            	<div class="row">
		            		
		            			<div class="col-md-3">
			                        <div class="form-group">
			                            <label>File Type</label>
			                            <select class="form-control" id="file_spec_upload_type">
											<option value="image">Image File</option>
											<option value="youtube">Youtube Video</option>
										</select>
			                        </div>
			                    </div>

			                    <div class="col-md-3">
			                    	<div class="form-group">
			                    		<label>File/File Group Name (to search file better)</label>
			                    		<input type="text" class="form-control" name="file_spec_group_name">
			                    	</div>
			                    </div>

			                   <!--  <div class="col-md-6">
			                    	<div class="form-group">
			                    		<label>Select File</label>
			                    		<input type="file" name="file_browse_file[]" id="filer_input" multiple="multiple">
			                    	</div>
			                    </div> -->

			                    <div class="col-md-6">
				                    <div class="input-group col-xs-12">
				                    	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
				                    	<input type="file" name="file_browse_file" class="file-upload-default" style="visibility: hidden;">
										<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
										<span class="input-group-append">
											<button class="file-upload-browse btn btn-primary" type="button">Browse Image</button>
											<button class="btn btn-primary" type="submit" id="btn_upload_files">Upload</button>
										</span>
									</div>
									<div class="progress ht-5" style="margin-top: 2px;margin-bottom: 2px;margin-left: 398px;margin-right: -4px;">
									  <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
									</div>
								</div>
		            		
		                    
		                </div>
	                </form>
	        		<!-- <div class="col-lg-9">
						<div class="table-responsive">
							<table id="files_list_table" class="table" style="width:100%;">
								<thead>
			                      <tr>
			                        <th>#</th>
			                        <th>File</th>
			                        <th>Action</th>
			                      </tr>
			                    </thead>
			                    <tbody>		                    	
			                    </tbody>
							</table>
						</div>
					</div> -->


					<div class="row">
						<div class="table-responsive">
							<table class="table" id="filter_table">
								<thead>
									<th>Filter With File Type</th>
									<th>Filter With Name</th>
									<th></th>
								</thead>
								<tbody>
									<tr>
										<td>
											<select class="form-control" id="file_upload_type" name="file_upload_type">
												<option value="0">Select File Type</option>
												<option value="image">Image File</option>
												<option value="youtube">Youtube Video</option>
											</select>
										</td>
										<td>
											<input type="text" class="form-control" id="file_up_name">
										</td>
										<td><button class="btn btn-primary" type="button" id="btn_search_file">Search</button></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
	        

	        	<div class="row">
	            	<div class="col-md-12">

	            		<div class="jFiler jFiler-theme-default">
							<div class="jFiler-items jFiler-row" style="max-height: 600px !important;height:500px;overflow-x: hidden;overflow-y: auto;" id="div_to_scroll">
							  	<ul class="jFiler-items-list jFiler-items-grid" id="file_list_grid">
							  		
							  	</ul>
							</div>
						</div>

	            	</div>
	          	</div>
	        </div>
	        
		</div>
	</div>
</div>

<style type="text/css">
	#files_list_table td img {
	    width: 50px !important;
	    height: 50px !important;
	    border-radius: 0% !important;
	}
</style>

<script type="text/javascript">

	/*(function($){
		$.fn.loadScrollData = function(start,options) {

			alert(parent_folder);
			
			action	=	"inactive";
			
			var settings	=	$.extend({
				limit			:	30, //Default limit to get data,
				listCtrl		: 	'',	//Pass ID or Class where you want to scroll
				listingId		:	'', //Pass ID or Class where you want to append your data
				loadMsgId		:	'', //Loading message id
				_file_type		: 	$('#filter_table').find('#file_upload_type option:selected').val(),
				_file_name		: 	$('#filter_table').find('#file_up_name').val(),
				ajaxUrl			:	'', //Ajax file path to get data
				loadingMsg		:	'<div style:"text-align:center;">Please Wait...!</div>' //Loading message
			},options);


			console.log(settings._file_type);
			
			$.ajax({
				method	:	"POST",
				data	:	{[csrf_name]:csrf_hash,'getData':'ok','length':settings.limit,'start':start,'file_type':settings._file_type,'file_name':settings._file_name,parent_folder:parent_folder},
				url		:	settings.ajaxUrl,
				success	:	function(data){
					$(settings.listingId).append(data.html);
					
					if(data == ''){
						$(settings.loadMsgId).html('');
						action = 'active';
					}else{
						$(settings.loadMsgId).html(settings.loadingMsg);
						action = "inactive";
					}
				}
			});
		
			if(action == 'inactive'){
				action = 'active';
			}
			
			// $(window).scroll(function(){
			// 	if($(window).scrollTop() + $(window).height() > $(settings.listingId).height() && action == 'inactive'){
			// 		action  	=   'active';
			// 		start	  	=   parseInt(start)+parseInt(settings.limit);
			// 		setTimeout(function(){
			// 			$.fn.loadScrollData(start,options);
			// 		},1000);
			// 	}
			// });

			

			$(settings.listCtrl).scroll(function(){
				if($(settings.listCtrl).scrollTop() + $(settings.listCtrl).height() > $(settings.listingId).height() && action == 'inactive'){
					action  	=   'active';

					if(start<total_data){
						start	  	=   parseInt(start)+parseInt(settings.limit);
					}

					console.log(start);

					//start	  	=   parseInt(start)+parseInt(settings.limit);
					setTimeout(function(){
						$.fn.loadScrollData(start,options);
					},1000);
				}					
			});
						
		};
	}(jQuery));*/

	/*$(document).loadScrollData(0, {
        limit: 30,
        listCtrl: '#div_to_scroll',
        listingId: "#file_list_grid",
        loadMsgId: '#load-msg',
        _file_type: $('#filter_table').find('#file_upload_type option:selected').val(),
        _file_name: $('#filter_table').find('#file_up_name').val(),
        ajaxUrl: base_url+'/drivebrowsefiles',
        loadingMsg: '<div class="alert alert-warning p-1 text-center"><i class="fa fa-fw fa-spin fa-spinner"></i>Please Wait...!</div>',
        loadingSpeed: 10
    });*/

	function load_files(file_type=0,file_name=''){
		$.ajax({
			method	:	"POST",
			data	:	{[csrf_name]:csrf_hash,'length':30,'start':0,file_type:file_type,file_name:file_name,parent_folder:parent_folder},
			url		:	base_url+'/drivebrowsefiles',
			success	:	function(data){

				$('#specificFileBrowserModal').find('#file_spec_upload_parent_folder').val(parent_folder);
				$('#file_list_grid').html(data.html);
			}
		});
	}

		
	jQuery(function($) {
  	  'use strict';

		jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
		    return arg !== value;
		}, "Value must not equal arg.");

		var isFileTypeSelected=false;



		// $('#filer_input').filer({
		// 	showThumbs: true,
		// 	addMore: true,
		// 	allowDuplicates: false,
		// 	limit:5,
		// 	fileMaxSize:5,
		// 	addMore: true,
		// 	extensions:['jpg','jpeg','png','gif','pdf','webp'],
		// 	captions:{
		// 	    button: "Choose Files",
		// 	    feedback: "Choose files To Upload",
		// 	    feedback2: "files were chosen",
		// 	    drop: "Drop file here to Upload",
		// 	    removeConfirmation: "Are you sure you want to remove this file?",
		// 	    errors: {
		// 	        filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
		// 	        filesType: "Only Images are allowed to be uploaded.",
		// 	        filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-fileMaxSize}} MB.",
		// 	        filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB.",
		// 	        folderUpload: "You are not allowed to upload folders."
		// 	    }
		// 	},
		// 	templates: {
		// 		box: '<ul class="jFiler-items-list jFiler-items-grid"></ul>',
		// 		item: '<li class="jFiler-item">\
		// 					<div class="jFiler-item-container">\
		// 						<div class="jFiler-item-inner">\
		// 							<div class="jFiler-item-thumb">\
		// 								<div class="jFiler-item-status"></div>\
		// 								<div class="jFiler-item-thumb-overlay">\
		// 									<div class="jFiler-item-info">\
		// 										<div style="display:table-cell;vertical-align: middle;">\
		// 											<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
		// 											<span class="jFiler-item-others">{{fi-size2}}</span>\
		// 										</div>\
		// 									</div>\
		// 								</div>\
		// 								{{fi-image}}\
		// 							</div>\
		// 							<div class="jFiler-item-assets jFiler-row">\
		// 								<ul class="list-inline pull-left">\
		// 									<li>{{fi-progressBar}}</li>\
		// 								</ul>\
		// 								<ul class="list-inline pull-right">\
		// 									<li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
		// 								</ul>\
		// 							</div>\
		// 						</div>\
		// 					</div>\
		// 				</li>',
		// 		itemAppend: '<li class="jFiler-item">\
		// 						<div class="jFiler-item-container">\
		// 							<div class="jFiler-item-inner">\
		// 								<div class="jFiler-item-thumb">\
		// 									<div class="jFiler-item-status"></div>\
		// 									<div class="jFiler-item-thumb-overlay">\
		// 										<div class="jFiler-item-info">\
		// 											<div style="display:table-cell;vertical-align: middle;">\
		// 												<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
		// 												<span class="jFiler-item-others">{{fi-size2}}</span>\
		// 											</div>\
		// 										</div>\
		// 									</div>\
		// 									{{fi-image}}\
		// 								</div>\
		// 								<div class="jFiler-item-assets jFiler-row">\
		// 									<ul class="list-inline pull-left">\
		// 										<li><span class="jFiler-item-others">{{fi-icon}}</span></li>\
		// 									</ul>\
		// 									<ul class="list-inline pull-right">\
		// 										<li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
		// 									</ul>\
		// 								</div>\
		// 							</div>\
		// 						</div>\
		// 					</li>',
		// 		progressBar: '<div class="bar"></div>',
		// 		itemAppendToEnd: false,
		// 		canvasImage: true,
		// 		removeConfirmation: true,
		// 		_selectors: {
		// 			list: '.jFiler-items-list',
		// 			item: '.jFiler-item',
		// 			progressBar: '.bar',
		// 			remove: '.jFiler-item-trash-action'
		// 		}
		// 	},
		// 	onSelect: function(inputEl){
		// 		var selected_type=$('#file_spec_upload_type :selected').val();
		// 		if(selected_type==0){
		// 			alert('Select file type');
		// 			isFileTypeSelected=false;
		// 		}else{
		// 			isFileTypeSelected=true;
		// 		}
		// 	},
		// 	uploadFile: {
		// 		url: "<?php echo $this->data['admin_base_url'];?>/driveuploadbrowsefile",
		// 		data: {[csrf_name]:csrf_hash,file_spec_upload_parent_folder:parent_folder,file_spec_upload_type:$('#file_spec_upload_type option:selected').val(),file_spec_group_name:$('#file_spec_group_name').val()},
		// 		type: 'POST',
		// 		enctype: 'multipart/form-data',
		// 		synchron: true,
		// 		beforeSend: function(){},
		// 		success: function(data, itemEl, listEl, boxEl, newInputEl, inputEl, id){
		// 			var parent = itemEl.find(".jFiler-jProgressBar").parent(),
		// 				filerKit = inputEl.prop("jFiler");

		// 				setTimeout(function(){
		// 					filerKit.reset();
		// 				},12000);




	 //        		if(isFileTypeSelected===true){
		// 				itemEl.find(".jFiler-jProgressBar").fadeOut("slow", function(){
		// 					$("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Success</div>").hide().appendTo(parent).fadeIn("slow");
		// 				});
	 //        		}else{
	 //        			itemEl.find(".jFiler-jProgressBar").fadeOut("slow", function(){
		// 					$("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i> Error</div>").hide().appendTo(parent).fadeIn("slow");
		// 				});
	 //        		}

					
		// 		},
		// 		error: function(el){
		// 			var parent = el.find(".jFiler-jProgressBar").parent();
		// 			el.find(".jFiler-jProgressBar").fadeOut("slow", function(){
		// 				$("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i> Error</div>").hide().appendTo(parent).fadeIn("slow");
		// 			});
		// 		},
		// 		statusCode: null,
		// 		onProgress: null,
		// 		onComplete: function(data, itemEl, listEl, boxEl, newInputEl, inputEl, id){
		// 			load_files();				
		// 		}
		// 	},
		// 	onRemove: function(itemEl, file, id, listEl, boxEl, newInputEl, inputEl){
		// 		var filerKit = inputEl.prop("jFiler"),
		// 	        file_name = filerKit.files_list[id].name;

		// 	    //$.post('./php/ajax_remove_file.php', {file: file_name});
		// 	},
		// 	onEmpty: null,
		// 	options: null,
		// 	dialogs: {
		// 		alert: function(text) {
		// 			return alert(text);
		// 		},
		// 		confirm: function (text, callback) {
		// 			confirm(text) ? callback() : null;
		// 		}
		// 	},
		// });


		$('body').on('click','#btn_search_file',function(){
			var _file_type=$('#filter_table').find('#file_upload_type option:selected').val();
			var _file_name=$('#filter_table').find('#file_up_name').val();
			load_files(_file_type,_file_name);
		}); 


		$('#specificFileBrowserModal').on('shown.bs.modal', function (e) {
		  $('#files_list_table').DataTable({ 
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
		          "url": base_url+'/drivebrowsefile',
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
		})

		$('#specificFileBrowserModal').on('hidden.bs.modal', function () {
		    $('#files_list_table').DataTable().destroy();
		});



		$('#specificFileBrowserModal').on('shown.bs.modal', function (e) {
			$('#buttons_wrapper').hide();
		  	load_files();
		});


		$('#specificFileBrowserModal').on('hidden.bs.modal', function (e) {
			$('#buttons_wrapper').show();
		  	$('#file_list_grid').html('');
		  	localStorage.clear();
		});


		$('#form_spec_file_upload').validate({
		    rules: {
		        file_spec_upload_type: {
		            valueNotEquals: '0'
		        }
		    },
		    messages: {
		        file_spec_upload_type: {
		            valueNotEquals: 'Select file type'
		        }
		    },
		    submitHandler: function(form) {
		        // Prevent default form submission
		        event.preventDefault();

		        // FormData for file upload
		        var formData = new FormData(form);
		        //console.log("Parent Folder: ", parent_folder); // Debugging line
		        //formData.append('file_spec_upload_parent_folder',parent_folder);

		        // Ajax call for file upload
		        $.ajax({
		            url: base_url + "/upload_driveuploadbrowsefile",
		            type: "POST",
		            data: formData,
		            contentType: false, // Required for formData
		            processData: false, // Required for formData
		            xhr: function() {
		                // Get XmlHttpRequest object
		                var xhr = $.ajaxSettings.xhr();

		                // Set up the onprogress event handler
		                xhr.upload.onprogress = function(event) {
		                    if (event.lengthComputable) {
		                        var percentComplete = Math.round((event.loaded / event.total) * 100);

		                        // Update the progress bar with the percentage complete
		                        $('.progress_bar').css('width', percentComplete + '%');
		                        $('.progress_bar').html(percentComplete + '%');
		                    }
		                };

		                // Return the modified XmlHttpRequest object
		                return xhr;
		            },
		            success: function(f) {
		                if(f.success){
				             Swal.fire({
				              icon: 'success',
				              title: f.success,
				              confirmButtonText:'Close',
				              confirmButtonColor:'#69da68',
				              allowOutsideClick: false,
				            });
				             load_files();
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
		            error: function(xhr, status, error) {
		                // Handle error
		                 Swal.fire({
				            icon: 'error',
				            title: 'Error has occurred while uploading the media file.',
				            confirmButtonText:'Close',
				            confirmButtonColor:'#69da68',
				            allowOutsideClick: false,
				          });
		            }
		        });
		    }
		});


		

		$('#form_spec_file_upload1').validate({
		    rules:{
		      file_spec_upload_type:{
		        valueNotEquals:'0'
		      }
		    },
		    messages:{
		      file_spec_upload_type:{
		        valueNotEquals:'Select file type'
		      }
		    },    
		    submitHandler:function(d){

		    	var formData=new FormData($('#form_spec_file_upload')[0]);

		       formData.append('file_spec_upload_parent_folder',parent_folder);

		      $.ajax({
		        type:'POST',
		        url: base_url+"/upload_driveuploadbrowsefile",
				data: formData,
		        cache: false,
		        contentType: false,
		        processData: false,
		        timeout: 60000000,
		        target: '.preview',
		        beforeSend:function(){
		          $('#btn_upload_spec_files').html('<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Uploading...</span></div>').attr('disabled',true);
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
		        error: function (jqXHR, textStatus, errorThrown) {

		        	console.log(jqXHR, textStatus, errorThrown);
		          
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
		          $('#btn_upload_spec_files').html('Upload').attr('disabled',false);
		          //get_files($('#form_file_browser_upload').find('#file_parent_folder').val());
		          $('#form_spec_file_upload')[0].reset();
		          load_files();
		        },
		        resetForm: true 
		      });
		    }
		});

		


	
  	$(document).on('click','.img-fluid',function(){
    	var dataimg=$(this).data('file');
        var datafile_id=$(this).data('file_id');
        var datafile_name=$(this).data('file_name');
        var datafile_ext=$(this).data('file_extension');
        var datafiletype=$(this).data('file_type');
        var heading_rows='';
        var cover_media_rows='';

        var media_operation=localStorage.getItem('media_operation');
        var media_row=localStorage.getItem('media_row');

        console.log(media_operation);

        if(media_operation=='update_media'){
        	$('#blog_post_details_data_type'+media_row).val(datafiletype);
        	$('#blog_post_details_data_type_value'+media_row).val(datafile_id);
        	$('#blog_post_details_post_content'+media_row).val(dataimg);
        	$('#blog_post_content_file_ext'+media_row).html('.'+datafile_ext);
        	$('#blog_post_content_file__ext'+media_row).val(datafile_ext);
        	$('#blog_post_content_file_name'+media_row).val(datafile_name);
        	$('#data_img_src'+media_row).attr('src','');
        	$('#data_img_src'+media_row).attr('src',dataimg);

        	$('#specificFileBrowserModal').modal('hide');
        }else if(media_operation=='add_cover_media'){
        	cover_media_rows+='<div class="form-group row">';
		    cover_media_rows+='<div class="col-md-12">';
		    cover_media_rows+='<input type="hidden" id="blog_post_cover_image_id" name="blog_post_cover_image_id" value="'+datafile_id+'">';
		    cover_media_rows+='<input type="hidden" id="blog_post_cover_image_file_name" name="blog_post_cover_image_file_name" value="'+datafile_name+'">';
		    cover_media_rows+='<input type="hidden" id="blog_post_cover_image" name="blog_post_cover_image" value="'+dataimg+'">';
		    cover_media_rows+='<div class="row"><img id="data_coberimg_src" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
		    cover_media_rows+='<div>';
		    cover_media_rows+='</div>';

		    cover_media_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" id="btn_update_cover_media" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media">Update Media</button></div></div>';

		    $('#row_cover_media').html(cover_media_rows);
		    if (document.querySelector('#blog_image_file_name')) {
			    $('#blog_image_file_name').val(datafile_name);
			    $('#blog_image_file_extension').html('.'+datafile_ext);
			}
		    $('#specificFileBrowserModal').modal('hide');
        }else if(media_operation=='update_cover_media'){
        	$('#blog_post_cover_image').val(dataimg);
        	$('#data_coberimg_src').attr('src','');
        	$('#data_coberimg_src').attr('src',dataimg);
        	if (document.querySelector('#blog_image_file_name')) {
        		$('#blog_post_cover_image_id').val(datafile_id);
			    $('#blog_image_file_name').val(datafile_name);
			    $('#blog_image_file_extension').html('.'+datafile_ext);
			}
        	$('#specificFileBrowserModal').modal('hide');
        }
        else if(media_operation=='add_media'){
        	heading_rows+='<tr id="trBlogPost' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<h6>Image Data</h6>';
		    heading_rows+='<input type="hidden" id="blog_post_details_data_type'+bposthdr+'" name="blog_post_details['+bposthdr+'][data_type]" value="'+datafiletype+'">';
		    heading_rows+='<input type="hidden" id="blog_post_details_data_type_value'+bposthdr+'" name="blog_post_details['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
		    heading_rows+='<input type="hidden" id="blog_post_details_post_content'+bposthdr+'" name="blog_post_details['+bposthdr+'][post_content]" value="'+dataimg+'">';
		    heading_rows+='<input type="hidden" id="blog_post_details_data_type_value'+bposthdr+'" name="blog_post_details['+bposthdr+'][data_serial]" value="'+bposthdr+'">';
		    heading_rows+='<div class="row">';
		    
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<img id="data_img_src'+bposthdr+'" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre" style="width:200px;height:200px;border-radius:0;"></div>';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<textarea type="text" class="form-control" id="blog_post_details_data_type_value'+bposthdr+'" name="blog_post_details['+bposthdr+'][data_alt_text]" row="4" placeholder="Enter Alt text"></textarea>';
		    heading_rows+='<div>';

		    heading_rows+='<div>';
		    heading_rows+='<div>';
		    heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="'+bposthdr+'" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trBlogPost' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='<tr>';

		    $('#blog_heading_rows tbody').append(heading_rows);
		    $('document.body').removeClass('modal-open');
	      	$('.modal-backdrop').remove();

		    $('#specificFileBrowserModal').modal('hide');

		    $([document.documentElement, document.body]).animate({
		        scrollTop: $("#trBlogPost"+bposthdr).offset().top
		    }, 2000);

	    	bposthdr++;
        }
        else if(media_operation=='add_placement_media'){
        	heading_rows+='<tr id="trPlacementData' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<h6>Image Data</h6>';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type]" value="'+datafiletype+'">';
		    heading_rows+='<input type="text" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_serial]" value="'+bposthdr+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_content]" value="'+dataimg+'">';
		    heading_rows+='<div class="row"><img id="data_img_src'+bposthdr+'" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre" style="width:50% !important;height: auto;border-radius: 0;"></div>';
		    heading_rows+='<div class="row"><input type="text" class="form-control" name="college_general_info['+bposthdr+'][data_type_value_alt]" placeholder="Enter SEO alternative text for the image" value=""></div>';
		    heading_rows+='<div>';
		    heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="'+bposthdr+'" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trPlacementData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='<tr>';

		    $('#data_heading_rows tbody').append(heading_rows);

		    $('#specificFileBrowserModal').modal('hide');

	    	bposthdr++;
        }
        else if(media_operation=='update_placement_media'){

        	//alert(media_row)

        	$('#college_general_info'+media_row).val(dataimg);
        	$('#data_img_src'+media_row).attr('src','');
        	$('#data_img_src'+media_row).attr('src',dataimg);
        	$('#specificFileBrowserModal').modal('hide');

        }
        else if(media_operation=='add_college_course_media'){

        	heading_rows+='<tr id="trCourseIntroData' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<h6>Image Data</h6>';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type]" value="'+datafiletype+'">';
		    heading_rows+='<input type="text" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_serial]" value="'+bposthdr+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_content]" value="'+dataimg+'">';
		    heading_rows+='<div class="row"><img id="data_img_src'+bposthdr+'" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
		    heading_rows+='<div>';
		    heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="'+bposthdr+'" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trCourseIntroData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='<tr>';

		    $('#data_heading_rows tbody').append(heading_rows);

		    $('#specificFileBrowserModal').modal('hide');

	    	bposthdr++;

        }else if(media_operation=='update_college_course_media'){

        	$('#college_general_info'+media_row).val(dataimg);
        	$('#data_img_src'+media_row).attr('src','');
        	$('#data_img_src'+media_row).attr('src',dataimg);
        	$('#specificFileBrowserModal').modal('hide');
        }else if(media_operation=='add_college_faculty_media'){

        	heading_rows+='<tr id="trFacultyIntroData' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<h6>Image Data</h6>';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type]" value="'+datafiletype+'">';
		    heading_rows+='<input type="text" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_serial]" value="'+bposthdr+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_content]" value="'+dataimg+'">';
		    heading_rows+='<div class="row"><img id="data_img_src'+bposthdr+'" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
		    heading_rows+='<div>';
		    heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="'+bposthdr+'" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trFacultyIntroData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='<tr>';

		    $('#data_heading_rows tbody').append(heading_rows);

		    $('#specificFileBrowserModal').modal('hide');

	    	bposthdr++;

        }else if(media_operation=='update_college_faculty_media'){
        	$('#college_general_info'+media_row).val(dataimg);
        	$('#data_img_src'+media_row).attr('src','');
        	$('#data_img_src'+media_row).attr('src',dataimg);
        	$('#specificFileBrowserModal').modal('hide');
        }else if(media_operation=='add_college_scholarship_media'){

        	heading_rows+='<tr id="trScholarshipsData' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<h6>Image Data</h6>';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type]" value="'+datafiletype+'">';
		    heading_rows+='<input type="text" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_serial]" value="'+bposthdr+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_content]" value="'+dataimg+'">';
		    heading_rows+='<div class="row"><img id="data_img_src'+bposthdr+'" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
		    heading_rows+='<div class="row"><input type="text" class="form-control" name="college_general_info['+bposthdr+'][data_type_value_alt]" placeholder="Enter SEO alternative text for the image" value=""></div>';
		    heading_rows+='<div>';
		    heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="'+bposthdr+'" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trScholarshipsData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='<tr>';

		    $('#data_heading_rows tbody').append(heading_rows);

		    $('#specificFileBrowserModal').modal('hide');

	    	bposthdr++;

        }else if(media_operation=='update_college_scholarship_media'){
        	$('#college_general_info'+media_row).val(dataimg);
        	$('#data_img_src'+media_row).attr('src','');
        	$('#data_img_src'+media_row).attr('src',dataimg);
        	$('#specificFileBrowserModal').modal('hide');
        }else if(media_operation=='add_college_results_media'){
        	heading_rows+='<tr id="trNews' + hdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<h6>RESULT DETAILS IMAGE</h6>';
		    heading_rows+='<input type="hidden" id="result_details'+hdr+'" name="result_details['+hdr+'][data_type]" value="'+datafiletype+'">';
		    heading_rows+='<input type="text" id="result_details'+hdr+'" name="result_details['+hdr+'][data_serial]" value="'+hdr+'">';
		    heading_rows+='<input type="hidden" id="result_details'+hdr+'" name="result_details['+hdr+'][data_type_value]" value="'+datafile_id+'">';
		    heading_rows+='<input type="hidden" id="result_details'+hdr+'" name="result_details['+hdr+'][data_content]" value="'+dataimg+'">';
		    heading_rows+='<div class="row"><img id="data_img_src'+hdr+'" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
		    heading_rows+='<div>';
		    heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="'+hdr+'" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trNews' + hdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='<tr>';

		    $('#heading_rows tbody').append(heading_rows);

		    $('#specificFileBrowserModal').modal('hide');

	    	hdr++;
        }else if(media_operation=='update_college_results_media'){
        	$('#result_details'+media_row).val(dataimg);
        	$('#data_img_src'+media_row).attr('src','');
        	$('#data_img_src'+media_row).attr('src',dataimg);
        	$('#specificFileBrowserModal').modal('hide');
        }else if(media_operation=='add_college_cutoff_media'){

        	heading_rows+='<tr id="trCutoffData' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<h6>Image Data</h6>';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type]" value="'+datafiletype+'">';
		    heading_rows+='<input type="text" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_serial]" value="'+bposthdr+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
		    heading_rows+='<input type="hidden" id="college_general_info'+bposthdr+'" name="college_general_info['+bposthdr+'][data_content]" value="'+dataimg+'">';
		    heading_rows+='<div class="row"><img id="data_img_src'+bposthdr+'" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
		    heading_rows+='<div>';
		    heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="'+bposthdr+'" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trCutoffData' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='<tr>';

		    $('#data_heading_rows tbody').append(heading_rows);

		    $('#specificFileBrowserModal').modal('hide');

	    	bposthdr++;

        }else if(media_operation=='update_college_cutoff_media'){
        	$('#college_general_info'+media_row).val(dataimg);
        	$('#data_img_src'+media_row).attr('src','');
        	$('#data_img_src'+media_row).attr('src',dataimg);
        	$('#specificFileBrowserModal').modal('hide');
        }else if(media_operation=='add_stream_media'){

        	heading_rows+='<tr id="trCutoffData' + hdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		    heading_rows+='<div class="col-md-12">';
		    heading_rows+='<h6>Image Data</h6>';
		    heading_rows+='<input type="hidden" id="stream_details'+hdr+'" name="stream_details['+hdr+'][data_type]" value="'+datafiletype+'">';
		    heading_rows+='<input type="hidden" id="stream_details'+hdr+'" name="stream_details['+hdr+'][data_serial]" value="'+hdr+'">';
		    heading_rows+='<input type="hidden" id="stream_details'+hdr+'" name="stream_details['+hdr+'][data_type_value]" value="'+datafile_id+'">';
		    heading_rows+='<input type="hidden" id="stream_details'+hdr+'" name="stream_details['+hdr+'][stream_content]" value="'+dataimg+'">';
		    heading_rows+='<div class="row"><img id="data_img_src'+hdr+'" src="'+dataimg+'" class="img-thumbnail" alt="Cinque Terre"></div>';
		    heading_rows+='<div>';
		    heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="'+hdr+'">Update Media</button><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trCutoffData' + hdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='<tr>';

		    $('#heading_rows tbody').append(heading_rows);

		    $('body').removeClass('modal-open');
			$('.modal-backdrop').remove();

		    $('#specificFileBrowserModal').modal('hide');

	    	hdr++;

        }else if(media_operation=='update_stream_media'){
        	$('#stream_details'+media_row).val(dataimg);
        	$('#data_img_src'+media_row).attr('src','');
        	$('#data_img_src'+media_row).attr('src',dataimg);
        	$('#specificFileBrowserModal').modal('hide');
        }
        else if(media_operation=='college_university_logo'){

        	$('#specificFileBrowserModal').modal('hide');
        }

		    

	    localStorage.setItem('media_operation','');   
  	});


		 $('.file-upload-browse').on('click', function(e) {
        var file = $(this).parent().parent().parent().find('.file-upload-default');
        file.trigger('click');
      });

      $('.file-upload-default').on('change', function() {
        $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
      });

	});
</script>