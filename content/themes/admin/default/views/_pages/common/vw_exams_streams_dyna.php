<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
	if(!empty($exams_streams)){
		foreach ($exams_streams as $key => $value) {
			?>
			<div class="form-check form-check-inline">
				<label class="form-check-label">
					<input type="checkbox" class="form-check-input" value="<?php echo $value['stream_id'];?>" name="exam_stream[]" <?php echo $value['selected'];?>>
					<?php echo $value['stream_name'];?>
				<i class="input-frame"></i></label>
			</div>
			<?php
		}
	}
?>