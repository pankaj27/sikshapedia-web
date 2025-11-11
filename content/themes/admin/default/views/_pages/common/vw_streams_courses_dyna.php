<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<option value="0">Select Course</option>
<?php
	if(!empty($courses)){
		foreach ($courses as $key => $value) {
			?>
			<option value="<?php echo $value['course_id'];?>"><?php echo $value['course_name'];?></option>
			<?php
		}
	}
?>