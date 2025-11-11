<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="row">
	<div class="col-lg-12">
		<div class="card userCard" style="border:none !important;">
			<form id="from_student_high_school_details" autocomplete="off">
				<div class="card-header bg-white text-center" style="border:none !important;"><h4 class="m-0 d-inline">HELPS US SERVE YOU BETTER</h4></div>
				<div class="card-body">
					
						<div class="row">
							<div class="form-group col-sm-4">
					            <label>10th Passing year <small class="form-text text-muted">(your full name)</small></label>
					            <input type="text" class="form-control passing_year" name="registration_10_pass_year" aria-describedby="registration_10_pass_year" placeholder="10th Passing year" value="<?php echo (isset($edu_details->details_10th_pass_year))?$edu_details->details_10th_pass_year:'';?>" autocomplete="off">
					        </div>
					        <div class="form-group col-sm-4">
				                <label>Grading System <small class="form-text text-muted">(to login into the system)</small></label>
				                <select class="form-control" name="registration_10th_grade">
				                	<option value="0">Grading System</option>
				                	<?php
				                	foreach ($grade_system as $key => $value) {
				                		?>
				                		<option value="<?php echo $value->grading_id;?>" <?php echo ($edu_details->edu_10th_grade_system==$value->grading_id)?'selected':'';?>><?php echo $value->grading_name;?></option>
				                		<?php
				                	}
				                	?>
				                </select>
				            </div>
				            <div class="form-group col-sm-4">
				                <label>10th Passing Marks <small class="form-text text-muted">(to login into the system)</small></label>
				                <input type="text" class="form-control" name="registration_10_pass_marks" aria-describedby="registration_10_pass_marks" placeholder="10th Passing Marks" value="<?php echo (isset($edu_details->detail_marks_value))?$edu_details->detail_marks_value:'';?>">
				            </div>
					    </div>

				        <div class="row">
							<div class="form-group col-sm-4">
					            <label>12th Passing year <small class="form-text text-muted">(your full name)</small></label>
					            <input type="text" class="form-control passing_year" name="registration_12_pass_year" aria-describedby="registration_12_pass_year" placeholder="12th Passing year" value="<?php echo (isset($edu_details->details_12th_pass_year))?$edu_details->details_12th_pass_year:'';?>">
					        </div>
					        <div class="form-group col-sm-4">
				                <label>Grading System <small class="form-text text-muted">(to login into the system)</small></label>
				                <select class="form-control" name="registration_12th_grade">
				                	<option value="0">Grading System</option>
				                	<?php
				                	foreach ($grade_system as $key => $value) {
				                		?>
				                		<option value="<?php echo $value->grading_id;?>" <?php echo ($edu_details->detail_gardes_type==$value->grading_id)?'selected':'';?>><?php echo $value->grading_name;?></option>
				                		<?php
				                	}
				                	?>
				                </select>
				            </div>
				            <div class="form-group col-sm-4">
				                <label>12th Passing Marks <small class="form-text text-muted">(to login into the system)</small></label>
				                <input type="text" class="form-control" name="registration_12_pass_marks" aria-describedby="registration_12_pass_marks" placeholder="12th Passing Marks" value="<?php echo (isset($edu_details->detail_12marks_value))?$edu_details->detail_12marks_value:'';?>">
				            </div>
				        </div>

				        <div class="row">
							<div class="form-group col-sm-4">
					            <label>Grad Passing year <small class="form-text text-muted">(your full name)</small></label>
					            <input type="text" class="form-control passing_year" name="registration_grad_pass_year" aria-describedby="registration_grad_pass_year" placeholder="Grad Passing year" value="<?php echo (isset($edu_details->details_grad_pass_year))?$edu_details->details_grad_pass_year:'';?>">
					        </div>
					        <div class="form-group col-sm-4">
				                <label>Grading System <small class="form-text text-muted">(to login into the system)</small></label>
				                <select class="form-control" name="registration_grad_grade">
				                	<option value="0">Grading System</option>
				                	<?php
				                	foreach ($grade_system as $key => $value) {
				                		?>
				                		<option value="<?php echo $value->grading_id;?>" <?php echo ($edu_details->edu_grad_grade_system==$value->grading_id)?'selected':'';?>><?php echo $value->grading_name;?></option>
				                		<?php
				                	}
				                	?>
				                </select>
				            </div>
				            <div class="form-group col-sm-4">
				                <label>Grad Passing Marks <small class="form-text text-muted">(to login into the system)</small></label>
				                <input type="text" class="form-control" name="registration_grad_pass_marks" aria-describedby="registration_grad_pass_marks" placeholder="Grad Passing Marks" value="<?php echo (isset($edu_details->detail_gradmarks_value))?$edu_details->detail_gradmarks_value:'';?>">
				            </div>
				        </div>

				        <div class="row">
				        	<div class="form-group col-sm-12">
			            		<label for="inputState">Brief About Your Educational Details <span class="span_star">(*)</span></label>
			            		<textarea class="form-control" name="registration_about_edu" name="registration_about_edu" rows="3" aria-hidden="true" placeholder="A Brief About Your Educational Details "><?php echo (isset($userdata->user_edu_brief))?$userdata->user_edu_brief:'';?></textarea>
			            	</div>
				        </div>
					
				</div>
				<div class="card-footer bg-white" style="border:none !important;">
					<div class="row">
					    <div class="form-group col-sm-12">
							<button type="submit" class="btn btn-primary" id="btn_update_highschool_info" style="float:right;">Update</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>