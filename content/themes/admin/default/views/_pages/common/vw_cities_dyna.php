<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<option value="0">Select City</option>
<?php
	if(!empty($cities)){
		foreach ($cities as $key => $value) {
			?>
			<option value="<?php echo $value['city_id'];?>"><?php echo $value['city_name'];?></option>
			<?php
		}
	}
?>