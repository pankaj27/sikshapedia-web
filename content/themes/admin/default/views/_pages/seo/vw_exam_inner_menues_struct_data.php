<form id="form_exam_metadata_update">	            	
	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	<input type="hidden" name="_exam" id="_exam" value="<?php echo $exam_id;?>">
	<input type="hidden" name="_exam_menu_id" id="_exam_menu_id" value="<?php echo $exam_menu_id;?>">
	<div class="row">
		<div class="col-md-6">
			<div class="row">
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam Page URL</label>
						<input type="text" class="form-control" placeholder="Enter page url" id="exam_page_url" name="exam_page_url" value="<?php echo (!empty($exam_slug_data))?$exam_slug_data->url_value:$exam_slug_url;?>">
					</div>
				</div>
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam Page Heading</label>
						<textarea class="form-control" name="__page_heading" id="exam_page_heading" rows="3"><?php echo (!empty($exam_slug_data))?$exam_slug_data->url_page_heading:'';?></textarea>
					</div>
				</div>
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam Meta Title</label>
						<textarea class="form-control" name="exam_meta_title" id="exam_meta_title" rows="3"><?php echo (!empty($exam_slug_data))?$exam_slug_data->url_meta_title:'';?></textarea>
					</div>
				</div>
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam Meta Keywords</label>
						<textarea class="form-control" placeholder="Enter meta keys" name="exam_meta_keywords" id="exam_meta_keywords" rows="3"><?php echo (!empty($exam_slug_data))?$exam_slug_data->url_meta_key_words:'';?></textarea>
					</div>
				</div>
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam Meta Desc</label>
						<textarea class="form-control" placeholder="Enter meta desc" name="exam_meta_desc" id="exam_meta_desc" rows="10"><?php echo (!empty($exam_slug_data))?$exam_slug_data->url_meta_desc:'';?></textarea>
					</div>
				</div>
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam OG Title</label>
						<textarea class="form-control" placeholder="Enter og title" name="exam_og_title" id="exam_og_title" rows="3"><?php echo (!empty($exam_slug_data))?$exam_slug_data->url_og_title:'';?></textarea>
					</div>
				</div>
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam OG Desc</label>
						<textarea class="form-control" placeholder="Enter og description" name="exam_og_desc" id="exam_og_desc" rows="5"><?php echo (!empty($exam_slug_data))?$exam_slug_data->url_og_desc:'';?></textarea>
					</div>
				</div>
			</div>
		</div>

		<div class="col-md-6">
			<div class="row">
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam Page Structure Data Short Description</label>
						<textarea class="form-control" name="short_description" id="short_description" rows="20"><?php echo (!empty($exam_structure_data_decode))?$exam_structure_data_decode->description:'';?></textarea>
					</div>
				</div>
				<div class="col-md-12">
            		<div class="form-group">
						<label>Exam Page Structure Data(Generated data will appear here)</label>
						<textarea class="form-control" name="exam_page_structure_data" id="exam_page_structure_data" rows="30"><?php echo (!empty($exam_structure_data))?$exam_structure_data->slug_type_json_ld_data:'';?></textarea>
					</div>
				</div>
				<div class="col-md-12">
					<pre id="struct_course_menu_data" class=json-container></pre>
				</div>			
			</div>
		</div>
		
	</div>

	<div class="row">
		<div class="col-md-12">	
        	<!-- <button type="button" class="btn btn-dark" id="btn_generate_exam_struct_data">Generate Structure Data</button>            	 -->
            <button type="submit" class="btn btn-primary" id="btn_update_exam_meta">Update</button>
        </div>
    </div>
</form>

<link rel=stylesheet href=https://cdn.jsdelivr.net/npm/pretty-print-json@2.0/dist/css/pretty-print-json.css>
<script src=https://cdn.jsdelivr.net/npm/pretty-print-json@2.0/dist/pretty-print-json.min.js></script>

<script type="text/javascript">
	$(document).ready(function(){
		$('#form_exam_metadata_update').validate({
		    rules:{
		      exam_page_url:{
		      	required:true
		      },
		      __page_heading:{
		      	required:true,
		      	maxlength:110
		      },
		      exam_meta_title:{
		      	required:true,
		      	maxlength:110		      	
		      },
		      exam_meta_keywords:{
		      	required:true		      	
		      },
		      exam_meta_desc:{
		      	required:true
		      },
		      exam_og_title:{
		      	required:true
		      },
		      exam_og_desc:{
		      	required:true
		      }
		    },
		    messages:{
		      exam_page_url:{
		      	required:'Enter URL'
		      },
		      __page_heading:{
		      	required:'Enter headeing',
		      	maxlength:'Maximum 110 charachters allowed'
		      },
		      exam_meta_title:{
		      	required:'Enter meta title',
		      	maxlength:'Maximum 110 charachters allowed'		      	
		      },
		      exam_meta_keywords:{
		      	required:'Enter meta key'		      	
		      },
		      exam_meta_desc:{
		      	required:'Enter meta description'
		      },
		      exam_og_title:{
		      	required:'Enter og title'
		      },
		      exam_og_desc:{
		      	required:'Enter og description'
		      }
		    },
		    submitHandler:function(){
		    	$.ajax({
		    		type:'POST',
		    		url:base_url+'/seo/exams/add_meta',
		    		data:$('#form_exam_metadata_update').serialize(),
		    		cache:false,
		    		beforeSend:function(){
		    			$('#btn_update_exam_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Updating...</span>').prop('disabled',true);
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

		    				$('#exam_page_structure_data').val(d.struct_data);
		    				//generate_meta_code($('#exam_page_structure_data').val());
		    			}else{
		    				Swal.fire({
				              icon: 'error',
				              title: d.error,
				              confirmButtonText:'Close',
				              confirmButtonColor:'#d33',
				              allowOutsideClick: false,
				            });
		    			}
		    		},
		    		complete:function(xhr,status){
		    			$('#btn_update_exam_meta').html('Update').prop('disabled',false);
		    		}
		    	});
		    }
		});

		function generate_meta_code(data){
			const elem = document.getElementById('struct_course_menu_data');
			elem.innerHTML = prettyPrintJson.toHtml(data);			
	    }
	});
</script>