<h6>Reviews On</h6>
<hr>


<?php

if($userdata->user_role=='1'){
	?>
	<div class="row">
		<div class="col-md-12">
    		<div class="form-group">
				<label>Review as Anonymus</label>
				<input type="text" class="form-control" placeholder="Heading" name="review_user_name" id="review_user_name" value="<?php echo !empty($review_data)?$review_data->review_user_name:'';?>">
			</div>
		</div>
	</div>
	<?php
}
?>
		
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label>Set Nice Title</label>
			<input type="text" class="form-control" placeholder="Heading" name="review_heading" id="review_heading" value="<?php echo !empty($review_data)?$review_data->review_title:'';?>">
		</div>
	</div>
</div>

<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Admission Process & Exams info-Rating (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[0][step]" value="step_1">
			<input type="hidden" name="review_steps[0][question_type]" value="1">
			<select class="form-control"  name="review_steps[0][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[0]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_steps[0][answer]"><?php echo (!empty($review_q_data))?$review_q_data[0]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Course Curriculam & Faculty info-Rating (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[1][step]" value="step_2">
			<input type="hidden" name="review_steps[1][question_type]" value="2">
			<select class="form-control" name="review_steps[1][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[1]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_steps[1][answer]"><?php echo (!empty($review_q_data))?$review_q_data[1]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Loan & Scholarship Info (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[2][step]" value="step_3">
			<input type="hidden" name="review_steps[2][question_type]" value="3">
			<select class="form-control"  name="review_steps[2][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[2]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review"  name="review_steps[2][answer]"><?php echo (!empty($review_q_data))?$review_q_data[2]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Fees Structure & Facilities Info-Rating (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[3][step]" value="step_4">
			<input type="hidden" name="review_steps[3][question_type]" value="4">
			<select class="form-control"  name="review_steps[3][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[3]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_steps[3][answer]"><?php echo (!empty($review_q_data))?$review_q_data[3]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Campus & Social Life Info (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[4][step]" value="step_5">
			<input type="hidden" name="review_steps[4][question_type]" value="5">
			<select class="form-control" name="review_steps[4][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[4]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_steps[4][answer]"><?php echo (!empty($review_q_data))?$review_q_data[4]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Hostel Facility or Accomodation Info (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[5][step]" value="step_6">
			<input type="hidden" name="review_steps[5][question_type]" value="6">
			<select class="form-control"  name="review_steps[5][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[5]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_steps[5][answer]"><?php echo (!empty($review_q_data))?$review_q_data[5]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Internship Review (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[6][step]" value="step_7">
			<input type="hidden" name="review_steps[6][question_type]" value="7">
			<select class="form-control" name="review_on_internship" name="review_steps[6][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[6]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_steps[6][answer]"><?php echo (!empty($review_q_data))?$review_q_data[6]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Campus Placement Info-Rating (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[7][step]" value="step_8">
			<input type="hidden" name="review_steps[7][question_type]" value="8">
			<select class="form-control" name="review_steps[7][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[7]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_steps[7][answer]"><?php echo (!empty($review_q_data))?$review_q_data[7]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>				

<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Interview Review (minimum 200 charachters required)</label>
			<input type="hidden" name="review_steps[8][step]" value="step_9">
			<input type="hidden" name="review_steps[8][question_type]" value="9">
			<select class="form-control"  name="review_steps[8][rating]" style="margin-bottom:10px;">
				<?php
				for ($i=1; $i <=10 ; $i++) { 
					?>
					<option value="<?php echo $i;?>" <?php echo (!empty($review_q_data) && ($review_q_data[8]->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
					<?php
				}
				?>
			</select>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_steps[8][answer]"><?php echo (!empty($review_q_data))?$review_q_data[8]->review_question_answer:'';?></textarea>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">College Review (minimum 200 charachters required)</label>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_detail_college"><?php echo (!empty($review_data))?$review_data->review_inst_overall:'':'' ;?></textarea>
		</div>
	</div>
</div>
<div class="row">
	<div class="col-md-12">
		<div class="form-group">
			<label class="control-label">Remarks (minimum 30 words required)</label>
			<textarea class="form-control review_detail" rows="3" placeholder="Write your detailed review" name="review_remarks"><?php echo (!empty($review_data))?$review_data->review_remarks:'':'' ;?></textarea>
		</div>
	</div>
</div>

	            	
</div>
<div class="modal-footer">	            	
<button type="submit" class="btn btn-primary" id="btn_update_review">Submit</button>
</div>