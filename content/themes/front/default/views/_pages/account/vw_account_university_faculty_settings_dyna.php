<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="card userCard">
	<div class="card-header bg-white">
	  <h5 class="m-0 d-inline">Faculties <a href="#facultyRegModal" data-toggle="modal" class="btn btn-sm btn-primary pull-right">Add</a></h5>
	</div>
	<div class="card-body">

			<div class="table-responsive">
                <table class="table display table-striped no-wrap" id="faculty_list_table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone No.</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
                </table>
            </div>

	</div>
</div>

<div class="modal fade logRegModal" id="facultyRegModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
    <div class="modal-content">
    	<div class="logSignSec">
    		<div class="head d-flex align-items-center justify-content-between">
	          <h5>Add Faculty</h5>
	          <ul class="nav flex-row">
	              <li class="nav-item ">
	                <button class="nav-link btn" href="#" data-dismiss="modal" aria-label="Close"><span class="fas fa-times"></span></button>
	              </li>
	          </ul>
	        </div>
	        <div class="logSignContent">
	        	<!-- <div class="secLeft"></div> -->
	        	<div class="secFull">
	        		<div class="secInner">
	        			<form id="form_faculty_settings">
					      	<div class="row">						      	
								<input type="hidden" name="data_type" value="faculty_settings">
								<div class="col-sm-6">
									<div class="form-group">
										<label>Name</label>
						            	<input type="text" class="form-control" id="registration_faculty_name" name="registration_faculty_name" aria-describedby="registration_faculty_name" placeholder="Enter Name" value="">
					            	</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label>Email</label>
						            	<input type="text" class="form-control" id="registration_faculty_email" name="registration_faculty_email" aria-describedby="registration_faculty_email" placeholder="Enter Email" value="">
					            	</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label>Phone</label>
						            	<input type="text" class="form-control" id="registration_faculty_phone" name="registration_faculty_phone" aria-describedby="registration_faculty_phone" placeholder="Enter Contact No." value="">
					            	</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label>Experience</label>
						            	<input type="text" class="form-control" id="registration_faculty_exp" name="registration_faculty_exp" aria-describedby="registration_faculty_exp" placeholder="Enter Contact No." value="">
					            	</div>
								</div>

								<div class="col-sm-6">
					             	<div class="form-group">
						                <label class="d-block">Designation</label>
						                <select class="form-control" name="registration_designation" id="registration_designation">
											<option value="">Select Designation</option>
											<?php
											if(!empty($designations)){
												foreach ($designations as $key => $value) {
													?>
													<option value="<?php echo $value['designation_id'];?>"><?php echo $value['designation_name'];?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
					            </div>

								<div class="col-sm-6">
					             	<div class="form-group">
						                <label class="d-block">Department</label>
						                <select class="form-control" name="registration_department" id="registration_department">
											<option value="">Select Department</option>
											<?php
											if(!empty($departments)){
												foreach ($departments as $key => $value) {
													?>
													<option value="<?php echo $value['department_id'];?>"><?php echo $value['department_name'];?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
					            </div>

					            <div class="col-sm-12">
									<div class="form-group">
						                <label class="d-block">Qualifications</label>
						                <select class="form-control js-example-basic-multiple" name="registration_quallifications[]" id="registration_quallifications" multiple="multiple" style="width: 100%">
						                	 <?php
											if(!empty($qualifications)){
												foreach ($qualifications as $key => $value) {
													?>
													<option value="<?php echo $value['qualification_id'];?>"><?php echo $value['qualification_name'];?></option>
													<?php
												}
											}
											?>
						                </select>
							               
									</div>
					            </div>


					            <div class="col-sm-12">
					            	<div class="form-group">
						                <label class="d-block">Subjects</label>
						                <select class="form-control js-example-basic-multiple" name="registration_subjects[]" id="registration_subjects" multiple="multiple" style="width: 100%">
							                <?php
											if(!empty($subjects)){
												foreach ($subjects as $key => $value) {
													?>
										            <option value="<?php echo $value['subject_id'];?>" <?php echo $value['selected'];?>><?php echo $value['subject_name'];?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
					            </div>

					            <div class="col-sm-12">
						           <button type="submit" class="btn btn-primary" id="btn_update_faculty">Add</button>
						        </div>
							    
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
    </div>
  </div>
</div>

<script type="text/javascript">
	
	$(document).ready(function(){
		const Toast = Swal.mixin({
		    toast: true,
		    position: 'top',
		    showConfirmButton: false,
		    timer: 10000
		});
		jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
		  	return arg !== value;
		}, "Value must not equal arg.");
		$('#form_faculty_settings').validate({
		    rules:{
		      registration_faculty_name:{
		        required:true
		      },
		      registration_faculty_email:{
		        email:true
		      },
		      registration_department:{
		      	valueNotEquals:''
		      },
		      registration_designation:{
		      	valueNotEquals:''
		      }
		    },
		    messages:{
		      registration_faculty_name:{
		        required:'Enter faculty name'
		      },
		      registration_faculty_email:{
		        email:'Enter valid faculty email'
		      },
		      registration_department:{
		      	valueNotEquals:'Select department'
		      },
		      registration_designation:{
		      	valueNotEquals:'Select designation'
		      }
		    },
		    submitHandler:function(f){
		      var formData = new FormData($('#form_faculty_settings')[0]);
		      formData.append('csrf_test_name', csrf_hash);

		      $.ajax({
		        type:'POST',
		        url:base_url+'updateaccount',
		        data: formData,
		        cache: false,
		        contentType: false,
		        processData: false,
		        timeout: 60000000,
		        beforeSend:function(){
		          $('#registration_faculty_name').prop('disabled',true);
		          $('#registration_faculty_email').prop('disabled',true);
		          $('#btn_update_faculty').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
		        },
		        success:function(d,status,xhr){
		          if(d.success){
		            Toast.fire({
		              icon: 'success',
		              title: d.success
		            });
		            $('#registration_faculty_name').prop('disabled',false);
		            $('#registration_faculty_email').prop('disabled',false);
		            $('#registration_faculty_phone').prop('disabled',false);
		            $('#btn_update_faculty').html('Update').prop('disabled',false);
		            $('#form_faculty_settings')[0].reset();
		            var table=$('#faculty_list_table').DataTable();
		            table.ajax.reload( null, false );        
		          }else{
		            Toast.fire({
		              icon: 'error',
		              title: d.error
		            });
		            $('#registration_faculty_name').prop('disabled',false);
		            $('#registration_faculty_email').prop('disabled',false);
		            $('#registration_faculty_phone').prop('disabled',false);
		            $('#btn_update_faculty').html('Update').prop('disabled',false);
		          }
		        },
		        error: function( jqXhr ) {
		          if( jqXhr.status == 400 ) {
		            window.location.reload();
		          }else if( jqXhr.status == 403 ) {
		            window.location.reload();
		          }
		          $('#registration_faculty_name').prop('disabled',false);
		          $('#registration_faculty_email').prop('disabled',false);
		          $('#registration_faculty_phone').prop('disabled',false);
		          $('#btn_update_info').html('Update').prop('disabled',false);
		        },
		        complete:function(status,xhr){
		         // $('#btn_submit').html('Sign In');
		        }
		      });
		    }
		});
	});
</script>