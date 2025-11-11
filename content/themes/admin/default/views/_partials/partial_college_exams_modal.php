<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="modal fade bd-example-modal-xl" id="CollegeExamModal" tabindex="-1" role="dialog" aria-labelledby="CollegeExamModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="CollegeExamModalTitle">Add Exams</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_update_college_exams_list">
	            <div class="modal-body">	            	
            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            		
            		<div class="row">
		      			<div class="col-md-12">
		      				<select class="form-control" id="college_exams_list" name="college_exams_list[]" multiple></select>
		      			</div>
					</div>	            	
	            </div>
	            <div class="modal-footer">	            	
	                <button type="submit" class="btn btn-primary" id="btn_update_college_exams">Update</button>
	            </div>
            </form>
        </div>
    </div>
</div>


<style type="text/css">
	#college_exams_list_chosen{
		width: 100% !important;
	}
</style>


<script type="text/javascript">
	jQuery(function($) {
  		'use strict';

  		$('#college_exams_list').chosen();

  		$('#CollegeExamModal').on('hidden.bs.modal', function () {
		 	$('#buttons_wrapper').show();
		});

		$('#CollegeExamModal').on('shown.bs.modal', function () {
		 	$('#buttons_wrapper').hide();

		 	

		 	$.ajax({
		 		type:'POST',
		 		url:base_url+'/exams/get_college_exams',
		 		data:{[csrf_name]:csrf_hash,college_id:_college},
		 		success:function(d){
		 			var html='';
		 			if(d.exams!=''){
		 				$.each(d.exams,function(i,v){
		 					html+='<option value="'+v['exam_id']+'">'+v['exam_name']+'</option>';
		 				});
		 			}

		 			$('#CollegeExamModal').find('#college_exams_list').html(html);
		 			$('#college_exams_list').trigger("chosen:updated");
		 		}
		 	});
		});


		$('#form_update_college_exams_list').validate({
			submitHandler:function(){
				var formData=new FormData($('#form_update_college_exams_list')[0]);
				formData.append('college_id',_college);
				$.ajax({
					type:'POST',
					url:base_url+'/institutions/add_college_exams_list',
					data:formData,
			        cache: false,
			        contentType: false,
			        processData: false,
			        timeout: 60000000,
			        target: '.preview',
			        beforeSend:function(){
			            $('#btn_update_college_exams').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
			        },
			        success:function(d){
			        	if(d.success){
			              $('#btn_update_college_exams').html('Update').prop('disabled',false);
			              Swal.fire({
			                icon: 'success',
			                title: f.success,
			                confirmButtonText:'Close',
			                confirmButtonColor:'#69da68',
			                allowOutsideClick: false,
			              });
			              window.location.reload();           
			            }else if(d.error){
			              $('#btn_update_college_exams').html('Save').prop('disabled',false);
			              Swal.fire({
			                icon: 'error',
			                title: f.error,
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
