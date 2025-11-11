

<div class="row">
	<div class="col-lg-12">
		<div class="card userCard" style="border:none !important;">
			<form id="from_student_higher_edu_details">
				<div class="card-header bg-white text-center" style="border:none !important;"><h4 class="m-0 d-inline">COURSES THAT INTERESTS YOU</h4></div>
				<div class="card-body" id="hedu_body">
					<?php $row=0;?>	

					<?php
					if(!empty($higher_edu_details)){
						foreach ($higher_edu_details as $key => $value) {
							?>
							<div class="row" id="row<?php echo $row;?>">
								<div class="form-group col-sm-6">
						            <label>Select Course </label>
						            <select class="form-control student_courses" name="higher_edu[<?php echo $row;?>][course]">
						            	<option value="0">Select Course</option>
						            </select>
						        </div>
						        <div class="form-group col-sm-3">
					                <label>Year Interested </label>
					                <input type="text" class="form-control passing_year" id="higher_edu_<?php echo $row;?>_year" name="higher_edu[<?php echo $row;?>][year]" aria-describedby="higher_edu_<?php echo $row;?>_year" placeholder="Year Interested" value="<?php echo $value->edu_year;?>">
					            </div>
					            <div class="form-group col-sm-3">
						            <label>Mode </label>
						            <select class="form-control" name="higher_edu[<?php echo $row;?>][mode]">
						            	<option value="0">Select Mode</option>
						            	<?php
						            	foreach ($course_program_type as $k => $v) {
						            		?>
						            		<option value="<?php echo $v->program_type_id;?>" <?php echo ($value->edu_mode==$v->program_type_id)?'selected':'';?>><?php echo $v->program_type_name;?></option>
						            		<?php
						            	}
						            	?>				            	
						            </select>
						            <button type="button" class="btn btn-sm btn-danger" style="float:right;" onclick="$('#row<?php echo $row;?>').remove()">Remove</button>
						        </div>
						    </div>
							<?php

							$row++;
						}
					}else{
						?>
						<div class="row" id="row<?php echo $row;?>">
							<div class="form-group col-sm-6">
					            <label>Select Course </label>
					            <select class="form-control student_courses" name="higher_edu[<?php echo $row;?>][course]">
					            	<option value="0">Select Course</option>
					            </select>
					        </div>
					        <div class="form-group col-sm-3">
				                <label>Year Interested </label>
				                <input type="text" class="form-control passing_year" id="higher_edu_<?php echo $row;?>_year" name="higher_edu[<?php echo $row;?>][year]" aria-describedby="higher_edu_<?php echo $row;?>_year" placeholder="Year Interested" value="">
				            </div>
				            <div class="form-group col-sm-3">
					            <label>Mode </label>
					            <select class="form-control" name="higher_edu[<?php echo $row;?>][mode]">
					            	<option value="0">Select Mode</option>
					            	<?php
					            	foreach ($course_program_type as $key => $value) {
					            		?>
					            		<option value="<?php echo $value->program_type_id;?>"><?php echo $value->program_type_name;?></option>
					            		<?php
					            	}
					            	?>				            	
					            </select>
					        </div>
					    </div>
						<?php
					}
					?>

					
					
				</div>
				<div class="card-footer bg-white" style="border:none !important;">
					<div class="row">
					    <div class="form-group col-sm-12">
					    	<button type="submit" class="btn btn-primary" id="btn_update_higher_edu_info" style="float:right;">Update</button>
					    	<button type="button" class="btn btn-warning" id="btn_higher_edu_row" style="float:right;">Add Course</button>
					    </div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<script type="text/javascript">var higher_edu_row='<?php echo ($row>0)?$row:($row+1);?>';var course_program_type=<?php echo json_encode($course_program_type);?></script>