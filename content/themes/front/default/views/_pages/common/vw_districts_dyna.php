<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<option value="">Select District</option>
<?php
	if(!empty($districts)){
		foreach ($districts as $key => $value) {
			?>
			<option value="<?php echo $value['district_id'];?>"><?php echo $value['district_name'];?></option>
			<?php
		}
	}
?>