<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($categories)){
	foreach ($categories as $key => $value) {
		?>
		<div class="col-lg-4">
			<div class="form-group">
			<?php
			foreach ($value as $k => $v) {
				?>
				<input type="checkbox" name="college_categories[]" value="<?php echo $v['inst_category_id'];?>" <?php echo $v['checked'];?>>  <span><?php echo $v['inst_category_name'];?> [<?php echo $v['inst_category_short_name'];?>]</span><br>
				<?php
			}
			?>
			</div>
		</div>
		<?php						
	}
}

?>