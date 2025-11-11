<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<option value="0">Select College</option>
<?php
	if(!empty($colleges)){
		foreach ($colleges as $key => $value) {
			?>
			<option value="<?php echo $value['college_id'];?>"><?php echo $value['college_name'];?></option>
			<?php
		}
	}
?>