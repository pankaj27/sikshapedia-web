<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<?php

if($control_type=='selectbox'){
	?>
	<option value="">Select State</option>
	<?php
	if(!empty($states)){
		foreach ($states as $key => $value) {
			?>
			<option value="<?php echo $value['state_id'];?>"><?php echo $value['state_name'];?></option>
			<?php
		}
	}
}else if($control_type=='checkbox'){
	if(!empty($states)){
		$i='1';
		foreach ($states as $key => $value) {
			?>
			<li>
		      <input class="filter" type="checkbox" id="checkbox<?php echo $i;?>">
		      <label class="checkbox-label" for="checkbox<?php echo $i;?>" value="<?php echo $value['state_id'];?>"><?php echo $value['state_name'];?></label>
		  	</li>
			<?php

			$i++;
		}
	}
}

?>

