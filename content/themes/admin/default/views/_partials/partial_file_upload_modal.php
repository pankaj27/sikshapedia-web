<div class="modal fade bd-example-modal-xl modal-fullscreen" id="fileUploadModal" tabindex="-1" role="dialog" aria-labelledby="fileUploadModal" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
                <h5 class="modal-title" id="updateParentMenuModalTitle">Updload File</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>

            <form id="form_file_upload" enctype="multipart/form-data">
	            <div class="modal-body">
            		<input type="hidden" name="file_upload_parent_folder" id="file_upload_parent_folder">
            		<input type="hidden" name="file_type_id" id="file_type_id">
            		<input type="hidden" name="file_type" id="file_type">
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
            		<div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>File Type</label>
                                <select class="form-control" name="file_upload_type" id="file_upload_type">
									<option value="0">Select File Type</option>
									<option value="syllabus_files">Syllabus Files</option>
									<option value="notification_files">Notification Files</option>
									<option value="application_files">Application Files</option>
									<option value="cutoff_files">Cutoff Files</option>
								</select>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <label>File Name</label>
                                <input type="text" class="form-control" name="file_upload_type_name" id="file_upload_type_name">
                            </div>
                        </div>
                        <div class="input-group col-md-12">	
                        	<input type="file" name="file_browse_file" class="file-upload-default" style="visibility: hidden;">	                          	
							<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
							<span class="input-group-append">
								<button class="file-upload-browse btn btn-primary" type="button">Browse Image</button>
								<button class="btn btn-primary" type="submit" id="btn_upload_other_files">Upload</button>
							</span>
						</div>
                    </div>
	            	
	            </div>
	            <div class="modal-footer">
	               <!-- <button type="submit" class="btn btn-primary">Upload File</button> -->
	            </div>
	        </form>
		</div>
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function(){
		$('#form_file_upload').validate({
		    rules:{
		      file_upload_type:{
		        valueNotEquals:'0'
		      },
		      file_upload_type_name:{
		        required:true,
		        minlength:10
		      }
		    },
		    messages:{
		      file_upload_type:{
		        valueNotEquals:'Select file type'
		      },
		      file_upload_type_name:{
		        required:'Enter file name'
		      }
		    },    
		    submitHandler:function(d){
		      $.ajax({
		        type:'POST',
		        url:base_url+'/settings/browser/_upload_other_file',
		        data:new FormData($('#form_file_upload')[0]),
		        cache: false,
		        contentType: false,
		        processData: false,
		        timeout: 60000000,
		        target: '.preview',
		        beforeSend:function(){
		          $('#btn_upload_other_files').html('<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Uploading...</span></div>').attr('disabled',true);
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
		          $('#btn_upload_other_files').html('Upload').attr('disabled',false);
		          //get_files($('#form_file_browser_upload').find('#file_parent_folder').val());
		        },
		        resetForm: true 
		      });
		    }
		});
	});
</script>