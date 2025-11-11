<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<?php
	if(!empty($affiliation_types)){
		?>
		
		<label class="control-label">College Affiliation</label><br>
		<?php
		foreach ($affiliation_types as $key => $value) {
			?>
			<div class="form-check form-check-inline">
				<label class="form-check-label">
					<input type="checkbox" class="form-check-input" value="<?php echo $value['statutory_body_id'];?>" name="college_affiliations[]">
					<?php echo $value['statutory_body_abbr'];?>
				<i class="input-frame"></i></label>
			</div>
			<?php
		}
	}
?>