<div class="col-lg-7">
	<div class="tab-content" id="v-pills-tabContent">
		<form id="form_course_structrued_data">
			<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
			<input type="hidden" name="struct_course_id" id="struct_course_id" value="">
			<input type="hidden" name="struct_course_menu_id" id="struct_course_menu_id" value="">
			<input type="hidden" name="struct_url_id" id="struct_url_id" value="<?php echo (!empty($course_slug_data))?$course_slug_data->url_id:'';?>">
			<div class="row mt-10">
				<div class="col-md-12">
					<div class="form-group">
			          <label>
			            <strong>Page Heading (maximum 110 charachter long)</strong>
			          </label>
			          <textarea class="form-control valid" placeholder="Enter meta heading" name="struct_page_heading" id="struct_page_heading" aria-invalid="false" rows="3"><?php echo (empty($course_menu_struct_data))?$course_slug_data->url_page_heading:json_decode($course_menu_struct_data->slug_type_json_meta_data)->headline;?></textarea>

			          
			        </div>
			    </div>
			    <div class="col-md-12">
					<div class="form-group">
			          <label>
			            <strong>Page Short Description</strong>
			          </label>
			          <textarea class="form-control valid" placeholder="Enter meta heading" id="struct_page_short_decription" name="struct_page_short_decription" aria-invalid="false" rows="20"><?php echo (!empty($course_menu_struct_data))?json_decode($course_menu_struct_data->slug_type_json_meta_data)->description:'';?></textarea>


			          <textarea class="form-control valid" name="struct_data_text" id="struct_data_text" aria-invalid="false" rows="20">
			          	<?php

						if(!empty($course_menu_struct_data)){
							echo $course_menu_struct_data->slug_type_json_ld_data;
						}

						?>
			          </textarea>
			        </div>
			    </div>
			    <div class="col-md-12">
			    	<div class="form-group">
			    		<button type="button" id="btn_generate_struct_data" class="btn btn-primary">Generate</button>

			    		<button type="button" id="btn_update_struct_data" class="btn btn-success">Update</button>

			    		<button type="button" id="btn_copy_struct_data" class="btn btn-warning">Copy Structure Data</button>
			    	</div>
			    </div>
			</div>
		</form>
	</div>
</div>

<div class="col-lg-5">
	<div class="tab-content" id="v-pills-tabContent">
		<div class="row">
			<div class="col-md-12">
				<pre id="struct_course_menu_data" class=json-container></pre>
			</div>
		</div>
	</div>
</div>
<link rel=stylesheet href=https://cdn.jsdelivr.net/npm/pretty-print-json@2.0/dist/css/pretty-print-json.css>
<script src=https://cdn.jsdelivr.net/npm/pretty-print-json@2.0/dist/pretty-print-json.min.js></script>
<script type="text/javascript">
	$(document).ready(function(){

		$('#form_course_structrued_data').validate({
	      rules:{
	        struct_page_heading:{
	          required:true,
	          maxlength:110,
	        },
	        struct_page_short_decription:{
	          required:true
	        }
	      }
	    });	    


	    $('body').on('click','#btn_generate_struct_data',function(){
	    	if($('#form_course_structrued_data').valid()){
	    		var formdata=new FormData($('#form_course_structrued_data')[0]);
		        formdata.append('data_action','generate_meta');
		        $.ajax({
		          type:'POST',
		          url:base_url+'/seo/courses/generate_coursemenu_struct_data',
		          data:formdata,
		          dataType:"Json",
		          cache:false,
		          contentType: false,
                  processData: false,
                  timeout: 60000000,
                  beforeSend:function(){
	              	$('#btn_generate_struct_data').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
	              },
		          success:function(d){
		            generate_neta_code(d);
		            $("#struct_data_text").val(JSON.stringify(d));
		          },
		          complete:function(xhr,status){
		          	$('#btn_generate_struct_data').html('Generate').prop('disabled',false);
		          }
		        });
	    	}
	    });

	    $('body').on('click','#btn_update_struct_data',function(){
	    	if($('#form_course_structrued_data').valid()){
	    		var formdata=new FormData($('#form_course_structrued_data')[0]);
		        formdata.append('data_action','save_meta');
		        $.ajax({
		          type:'POST',
		          url:base_url+'/seo/courses/update_coursemenu_struct_data',
		          data:formdata,
		          dataType:"Json",
		          cache:false,
		          contentType: false,
                  processData: false,
                  timeout: 60000000,
                  beforeSend:function(){
	              	$('#btn_update_struct_data').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
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
		            }else{
		            	Swal.fire({
		                  icon: 'error',
		                  title: d.error,
		                  confirmButtonText:'Close',
		                  confirmButtonColor:'#69da68',
		                  allowOutsideClick: false,
		                });
		            }
		          },
		          complete:function(xhr,status){
		          	$('#btn_update_struct_data').html('Update').prop('disabled',false);
		          }
		        });
	    	}
	    });

	    function generate_neta_code(data){
			const elem = document.getElementById('struct_course_menu_data');
			elem.innerHTML = prettyPrintJson.toHtml(data);			
	    }


	    $('body').on('click','#btn_copy_struct_data',function(){
	        //var data_url=$('#struct_data_text').val();
	    
	        // Create a temporary input element
	        var $tempInput =$('#struct_data_text');// $('<input>');
	        
	        // Append the value to the input element
	        //$tempInput.val(data_url);
	        
	        // Append the input element to the document
	        //$('body').append($tempInput);
	        
	        // Select the value in the input element
	        $tempInput.select();
	        
	        // Copy the selected value to the clipboard
	        document.execCommand('copy');
	        
	        // Remove the temporary input element
	        $tempInput.remove();
	        
	        // Optionally, provide some visual feedback
	        $(this).text('Copied!');
	        
	        // Reset the button text after 2 seconds
	        var button = $(this);
	        setTimeout(function() {
	          button.text('Copy Structured Data');
	        }, 2000);
	    });

			
	});
</script>