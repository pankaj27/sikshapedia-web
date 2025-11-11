<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php

if(!empty($cities)){
	?>
	<option value=""></option>
	<?php
	foreach ($cities as $key => $value) {
		?>
		<optgroup label="<?php echo $key;?>">
			<?php
			foreach ($value as $k => $v) {
				?>
				<option value="<?php echo $v['city_id'];?>"><?php echo $v['city_name'];?></option>
				<?php
			}
			?>
		</optgroup>
		<?php
	}
}

?>