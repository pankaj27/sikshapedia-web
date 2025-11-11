<form id="form_college_course_meta_edit">
	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
	<input type="hidden" name="college_id" id="college_id" value="<?php echo $college_id;?>">
	<input type="hidden" name="course_id" id="course_id" value="<?php echo $course_id;?>">

		<div class="row">
			<div class="col-sm-6 menu_des_div">
	      		<div class="form-group">
					<label class="control-label">Page URL</label>
					<input type="text" name="college_course_page_url" id="college_course_page_url" class="form-control" value="<?php echo (!empty($college_course_page_url))?$college_course_page_url->url_value:'';?>">
				</div>
			</div>

			<div class="col-sm-6 menu_des_div">
	      		<div class="form-group">
					<label class="control-label">Page heading</label>
					<textarea type="text" class="form-control" placeholder="Enter name" name="college_course_page_heading" id="college_inner_menu_page_heading" rows="3"><?php echo (!empty($college_course_page_url))?$college_course_page_url->url_page_heading:'';?></textarea>
				</div>
			</div>

			<div class="col-sm-6 menu_des_div">
	      		<div class="form-group">
					<label class="control-label">Meta Title</label>
					<textarea type="text" class="form-control" placeholder="Enter name" name="college_course_page_meta_title" id="college_inner_menu_meta_title" rows="3"><?php echo (!empty($college_course_page_url))?$college_course_page_url->url_meta_title:'';?></textarea>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-6 menu_des_div">
	      		<div class="form-group">
					<label class="control-label">Meta Description</label>
					<textarea type="text" class="form-control" placeholder="Enter Menu Meta Description" name="college_course_page_meta_description" id="college_course_page_meta_description" rows="5"><?php echo (!empty($college_course_page_url))?$college_course_page_url->url_meta_desc:'';?></textarea>
				</div>
			</div>

			<div class="col-sm-6 menu_des_div">
	       		<div class="form-group">
					<label class="control-label">Meta Keywords</label>
					<input type="text" class="form-control" placeholder="Enter Menu Meta Keywords" name="college_course_page_meta_keywords_edit" id="college_course_page_meta_keywords_edit" value="<?php echo (!empty($college_course_page_url))?$college_course_page_url->url_meta_key_words:'';?>">
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-6 menu_des_div">
	      		<div class="form-group">
					<label class="control-label">OG Title</label>
					<textarea type="text" class="form-control" placeholder="Enter name" name="college_inner_menu_og_title" id="college_inner_menu_og_title" rows="3"><?php echo (!empty($college_course_page_url))?$college_course_page_url->url_og_title:'';?></textarea>
				</div>
			</div>

			<div class="col-sm-6 menu_des_div">
	      		<div class="form-group">
					<label class="control-label">OG Description</label>
					<textarea class="form-control" rows="5" name="college_course_og_description" id="college_inner_menu_og_description" placeholder="Enter Meta Description" ><?php echo (!empty($college_course_page_url))?$college_course_page_url->url_og_desc:'';?></textarea>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12 menu_des_div">
	      		<div class="form-group">
					<label class="control-label">Page Search Heading</label>
					<textarea type="text" class="form-control" placeholder="Enter Page Search Heading" name="college_course_page_data_search_title" id="college_course_page_data_search_title" rows="3"><?php echo (!empty($search_data_found))?$search_data_found[0]->search_data_name:'';?></textarea>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12">
				<div class="form-group">
					<button type="submit" class="btn btn-sm btn-dark" id="btn_update_college_course_meta">Update Meta</button>
				</div>
			</div>
		</div>
</form>

<style type="text/css">
	.control-label{
		font-weight: bold;
	}
</style>


<script type="text/javascript">
	$(document).ready(function(){

		// The DOM element you wish to replace with Tagify
	  var input2 = document.querySelector('input[name=college_course_page_meta_keywords_edit]');

	  // initialize Tagify on the above input node reference
	  new Tagify(input2);


		$('#form_college_course_meta_edit').validate({
			rules:{
				college_course_page_heading:{
					required:true
				},
				college_course_page_meta_title:{
					required:true
				},
				college_course_page_meta_keywords_edit:{
					required:true
				},
				college_course_page_meta_description:{
					required:true
				},
				college_inner_menu_og_title:{
					required:true
				},
				college_course_og_description:{
					required:true
				},
				college_course_page_data_search_title:{
					required:true
				}
			},
			messages:{
				college_course_page_heading:{
					required:'Enter page heading',
				},
				college_course_page_meta_title:{
					required:'Enter page title'
				},
				college_course_page_meta_keywords_edit:{
					required:'Enter page keywords'
				},
				college_course_page_meta_description:{
					required:'Enter meta description'
				},
				college_inner_menu_og_title:{
					required:'Enter OG title'
				},
				college_course_og_description:{
					required:'Enter OG description'
				},
				college_course_page_data_search_title:{
					required:'Enter search title'
				}
			},
			submitHandler:function(){
				$.ajax({
					type:'POST',
					url:base_url+'/seo/college_course_meta_update',
					data:$('#form_college_course_meta_edit').serialize(),
					beforeSend:function(){
			            $('#btn_update_college_course_meta').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
			              $('#btn_update_college_course_meta').html('Update Meta').prop('disabled',false);
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
</script>