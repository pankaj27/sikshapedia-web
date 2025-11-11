<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php

if(!empty($courses)){
	?>
	<option value=""></option>
	<?php
	foreach ($courses as $key => $value) {
		?>
		<optgroup label="<?php echo $key;?>">
			<?php
			foreach ($value as $k => $v) {
				?>
				<option value="<?php echo $v['course_id'];?>"><?php echo $v['course_name'];?></option>
				<?php
			}
			?>
		</optgroup>
		<?php
	}
}

?>