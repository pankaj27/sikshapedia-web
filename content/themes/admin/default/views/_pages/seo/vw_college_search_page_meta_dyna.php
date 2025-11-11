<form id="form_college_search_page_meta">
	<div class="modal-body">	            	
		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		<input type="hidden" name="page_id" id="page_id" value="<?php echo $page_id;?>">
		<div class="row">
			<div class="col-md-6">
        		<div class="form-group">
					<label><strong>Page Heading</strong></label>
					<input type="text" class="form-control" placeholder="Enter meta heading" name="page_heading" id="page_heading" value="<?php echo (!empty($page_data))?$page_data->url_page_heading:'';?>">
				</div>
			</div>
			<div class="col-md-6">
        		<div class="form-group">
					<label><strong>Page Meta Title</strong></label>
					<input type="text" class="form-control" placeholder="Enter meta title" name="page_meta_title" id="page_meta_title" value="<?php echo (!empty($page_data))?$page_data->url_meta_title:'';?>">
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
        		<div class="form-group">
					<label><strong>Page Meta Keywords</strong></label>
					<input class="form-control" placeholder="Enter meta keys" name="page_meta_keywords" id="page_meta_keywords" value="<?php echo (!empty($page_data))?$page_data->url_meta_key_words:'';?>">
				</div>
			</div>
			<div class="col-md-6">
        		<div class="form-group">
					<label><strong>Page Meta Desc</strong></label>
					<textarea class="form-control" placeholder="Enter meta desc" name="page_meta_desc" id="page_meta_desc" rows="5"><?php echo (!empty($page_data))?$page_data->url_meta_desc:'';?></textarea>
				</div>
			</div>
		</div>
		
		<div class="row">
			<div class="col-md-6">
        		<div class="form-group">
					<label><strong>Page OG Title</strong></label>
					<input type="text" class="form-control" placeholder="Enter og title" name="page_og_title" id="page_og_title" value="<?php echo (!empty($page_data))?$page_data->url_og_title:'';?>">
				</div>
			</div>
			<div class="col-md-6">
        		<div class="form-group">
					<label><strong>Page OG Desc</strong></label>
					<textarea class="form-control" placeholder="Enter og description" name="page_og_desc" id="page_og_desc" rows="5"><?php echo (!empty($page_data))?$page_data->url_og_desc:'';?></textarea>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<div class="form-group">
					<label><strong>Page Search Heading</strong></label>
					<textarea class="form-control" placeholder="Enter page search heading" name="page_search_heading" id="page_search_heading" rows="5"><?php echo (!empty($search_data_found))?$search_data_found[0]->search_data_name:'';?></textarea>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<div class="form-group">
					<label><strong>Page Structure Data</strong></label>
					<textarea class="form-control" placeholder="Enter page structure data" name="page_structure_data" id="page_structure_data" rows="20"><?php echo (!empty($page_structure_data))?$page_structure_data->slug_type_json_ld_data:'';?></textarea>
				</div>
			</div>

			<div class="col-md-6">
				<div class="form-group">
					<label><strong>Page Structure Data (FAQ's)</strong></label>
					<textarea class="form-control" placeholder="Enter page faq structure data" name="page_faq_structure_data" id="page_faq_structure_data" rows="20"><?php echo (!empty($page_faq_structure_data))?$page_faq_structure_data->slug_type_json_ld_data:'';?></textarea>
				</div>
			</div>
		</div>	            	
	</div>
    <div class="modal-footer">	            	
        <button type="submit" class="btn btn-primary" id="btn_update_college_meta">Update</button>
    </div>
</form>

<script type="text/javascript">
	$(document).ready(function(){
		// The DOM element you wish to replace with Tagify
	    var input = document.querySelector('input[name=page_meta_keywords]');

	    // initialize Tagify on the above input node reference
	    new Tagify(input);

	    $('#form_college_search_page_meta').validate({
			rules:{
				page_heading:{
					required:true
				},
				page_meta_title:{
					required:true
				},
				page_meta_keywords:{
					required:true
				},
				page_meta_desc:{
					required:true
				},
				page_og_title:{
					required:true
				},
				page_og_desc:{
					required:true
				}
			},
			messages:{
				page_heading:{
					required:'Enter page heading'
				},
				page_meta_title:{
					required:'Enter page meta title'
				},
				page_meta_keywords:{
					required:'Enter meta keywords'
				},
				page_meta_desc:{
					required:'Enter meta description'
				},
				page_og_title:{
					required:'Enter OG title'
				},
				page_og_desc:{
					required:'Enter OG description'
				}
			},
			submitHandler:function(){
				$.ajax({
					type:'POST',
					url:base_url+'/seo/update_search_urls_meta',
					data:$('#form_college_search_page_meta').serialize(),
			        beforeSend:function(){
			            $('#btn_update_college_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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

				          	$('#editCollegeSearchMetaModal').modal('hide');
				        }    
				    },
				    complete:function(){
				    	$('#btn_update_college_meta').html('Update').prop('disabled',false);
				    	var table=$('#slug_list_table').DataTable();
              			table.ajax.reload( null, false );
				    }
				});
			}
		});
	});
</script>