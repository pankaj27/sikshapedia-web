<select class="chosen-select" name="applicant_course" id="applicant_course" data-placeholder="Course interested in">
	<option value="0">Select Course</option>
	<?php
	if(!empty($course_data)){
		foreach ($course_data as $key => $value) {
			?>
			<option value="<?php echo $value['course_id'];?>"><?php echo $value['course_formatted_name'];?></option>
			<?php
		}
	}

	?>
</select>