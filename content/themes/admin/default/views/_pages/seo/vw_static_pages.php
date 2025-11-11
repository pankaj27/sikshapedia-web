<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>">dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Pages's List</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Pages</h6>
					<div class="table-responsive">
						<table class="table">
							<thead>
		                      <tr>
		                        <th>Page</th>
		                        <th>Action</th>
		                      </tr>
		                    </thead>
		                    <tbody>
		                    <?php
		                    foreach ($pages as $key => $value) {
		                    	?>
		                    	<tr>
		                    		<td><?php echo $value;?></td>
		                    		<td><button data-page_id="<?php echo encode_data($key);?>" class="btn btn-xs btn-dark btn_page_meta_edit" data-toggle="modal" data-target="#editPageMetaModal">Meta Update</button></td>
		                    	</tr>
		                    	<?php
		                    }

		                    ?>                    	
		                    </tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- <div class="modal fade bd-example-modal-xl" id="editExamMetaModal" tabindex="-1" role="dialog" aria-labelledby="editExamMetaModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editExamMetaModalTitle">Edit Exam Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_exam_meta">
	            <div class="modal-body">	            	
	            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	            		<input type="hidden" name="_exam" id="_exam" value="">
	            		<input type="hidden" name="_exam_stream" id="_exam_stream">
						<div class="row">
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Page URL (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter page heading" id="exam_page_url" readonly="true">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Page Heading (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter page heading" name="exam_page_heading" id="exam_page_heading">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Meta Title (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter meta title" name="exam_meta_title" id="exam_meta_title">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Meta Keywords (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter meta keys" name="exam_meta_keywords" id="exam_meta_keywords" rows="3"></textarea>
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam Meta Desc (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter meta desc" name="exam_meta_desc" id="exam_meta_desc" rows="5"></textarea>
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam OG Title (Auto Generated)</label>
									<input type="text" class="form-control" placeholder="Enter og title" name="exam_og_title" id="exam_og_title">
								</div>
							</div>
							<div class="col-md-12">
			            		<div class="form-group">
									<label>Exam OG Desc (Auto Generated)</label>
									<textarea class="form-control" placeholder="Enter og description" name="exam_og_desc" id="exam_og_desc" rows="5"></textarea>
								</div>
							</div>
						</div>
	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_exam_meta">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div> -->


<div class="modal fade bd-example-modal-xl modal-fullscreen" id="editPageMetaModal" tabindex="-1" role="dialog" aria-labelledby="editPageMetaModal" aria-hidden="true" style="z-index:99999;">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editExamMetaModal2Title">Edit Page Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            
            <div class="modal-body">
            	
    			<form id="form_static_page_meta">
    				<input type="hidden" name="static_page_id" id="static_page_id">
    				<div class="row">
						<div class="col-md-6">
							<div class="row">
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Page Heading</label>
										<textarea class="form-control" name="page_heading" id="page_heading" rows="3"></textarea>
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Meta Title</label>
										<textarea class="form-control" name="page_meta_title" id="page_meta_title" rows="3"></textarea>
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Meta Keywords</label>
										<textarea class="form-control" placeholder="Enter meta keys" name="page_meta_keywords" id="page_meta_keywords" rows="3"></textarea>
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Meta Desc</label>
										<textarea class="form-control" placeholder="Enter meta desc" name="page_meta_desc" id="page_meta_desc" rows="10"></textarea>
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>OG Title</label>
										<textarea class="form-control" placeholder="Enter og title" name="page_og_title" id="page_og_title" rows="3"></textarea>
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>OG Desc</label>
										<textarea class="form-control" placeholder="Enter og description" name="page_og_desc" id="page_og_desc" rows="5"></textarea>
									</div>
								</div>
							</div>
						</div>

						<div class="col-md-6">
							<div class="row">
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Page Structure Data(Generated data will appear here)</label>
										<textarea class="form-control" name="page_structure_data" id="page_structure_data" rows="30"></textarea>
									</div>
								</div>
								<div class="col-md-12">
									<pre id="struct_page_menu_data" class="json-container"></pre>
								</div>			
							</div>
						</div>
						
					</div>
					<div class="row">
						<div class="col-md-6">
							<button type="submit" class="btn btn-xs btn-primary" id="btn_update_page_meta">Update Meta</button>
						</div>
					</div>
    			</form>
            		
            </div>
        </div>
    </div>
</div>


<div class="modal fade bd-example-modal-xl" id="examUrls" tabindex="-1" role="dialog" aria-labelledby="examUrls" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editExamMetaModalTitle">Edit Exam Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>

            <div class="modal-body">
            	<div class="row" id="exam_slugs_urls_div">
            		<div class="col-lg-12">
			            <div class="table-responsive">
			            	<table class="table table-bordered" id="exam_slugs_urls" style="width:100%;">
			            		<thead>
			            			<tr>
			            				<td class="menu_order">Menu Order</td>
			            				<td>Menu Nmae/Slug</td>
			            				<td>Action</td>
			            			</tr>
			            		</thead>
			            	</table>
			            </div>
			        </div>
		        </div>
		       
	        </div>
        </div>
    </div>
</div>

<style type="text/css">
	.swal2-container{
		z-index:99999;
	}
</style>

<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/rapid-automated-keyword-extraction@1.0.1/dist/index.min.js"></script>
<script type="text/javascript">var p_row ='';</script>

<script type="text/javascript">
	$(document).ready(function(){
		$('body').on('click','.btn_page_meta_edit',function(){
			var page_id=$(this).data('page_id');
			$('#static_page_id').val(page_id);

			$.ajax({
				type:'POST',
				url:base_url+'/seo/load_pages_meta',
				data:{[csrf_name]:csrf_hash,page_id:page_id},
				success:function(d){
					$('#page_heading').text(d.meta_data.url_meta_heading);
					$('#page_meta_title').val(d.meta_data.url_meta_title);
					$('#page_meta_keywords').val(d.meta_data.url_meta_key_words);
					$('#page_meta_desc').text(d.meta_data.url_meta_desc);
					$('#page_og_title').text(d.meta_data.url_og_title);
					$('#page_og_desc').text(d.meta_data.url_og_desc);
					$('#short_description').text(d.meta_data.url_og_desc);
					$('#page_structure_data').text(d.meta_strcut_data.slug_type_json_ld_data);
				}
			});
		});

		$('#form_static_page_meta').validate({
			rules:{

			},
			messages:{

			},
			submitHandler:function(){
				
			    var formData=new FormData($('#form_static_page_meta')[0]);
			    formData.append([csrf_name],csrf_hash);

	      		$.ajax({
	              type:'POST',
	              url:base_url+'/seo/update_pages_meta',
	              data:formData,
	              cache: false,
	              contentType: false,
	              processData: false,
	              timeout: 60000000,
	              beforeSend:function(){
	                $('#btn_update_page_meta').html('<span class="fa fa-circle-o-notch fa-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	              },
	              success:function(d){

	                if(d.success){
	                  $('#btn_update_page_meta').html('<i class="fa fa-plus-circle"></i> Save').prop('disabled',false);

	                  Swal.fire({
	                    icon: 'success',
	                    title: d.success,
	                    timer: 2000,
	                    showConfirmButton: false,
	                    allowOutsideClick: false,
	                  });


	                  // $('#form_college_master')[0].reset();
	                  
	                }else{
	                  Swal.fire({
	                    icon: 'error',
	                    title: d.error,
	                    confirmButtonText:'Close',
	                    confirmButtonColor:'#d33',
	                    allowOutsideClick: false,
	                  });

	                  $('#btn_update_page_meta').html('<i class="fa fa-plus-circle"></i> Save').prop('disabled',false);
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

	       
	                $('#btn_update_page_meta').html('Submit').prop('disabled',false);
	              },
	              complete:function(status,xhr){
	              }
	            });
			}
		});
	});
</script>