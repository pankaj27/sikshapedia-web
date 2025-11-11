<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<option value="0">Select University</option>
<?php
	if(!empty($universities)){
		foreach ($universities as $key => $value) {
			?>
			<option value="<?php echo $value['university_id'];?>"><?php echo $value['university_name'];?></option>
			<?php
		}
	}
?>