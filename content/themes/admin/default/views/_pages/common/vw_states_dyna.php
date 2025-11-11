<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($states)){

	if($listing_type=='1'){
		?>
		<option value="0">Select State</option>
		<?php
		foreach ($states as $key => $value) {
			?>
			<option value="<?php echo $value['state_id'];?>"><?php echo $value['state_name'];?></option>
			<?php
		}
	}else if($listing_type=='2'){
		?>
		<div class="form-group">
			<label class="control-label">Ads Visibility (States)</label>
		<?php
		foreach ($states as $key => $value){
			?>
			<div class="col-sm-3">
				<div class="form-group">
					<?php
					foreach ($value as $k => $v) {
						?>
						<input type="checkbox" name="ads_state[]" value="<?php echo $v['state_id'];?>" <?php echo $v['selected'];?>> <span><?php echo $v['state_name'];?></span><br>
						<?php
					}
					?>												
				</div>
			</div>
			<?php
		}
		?>												
			</div>
		</div>
		<?php
	}



	
}

