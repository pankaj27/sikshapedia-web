<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<?php
	if(!empty($cities)){
		foreach ($cities as $key => $value) {
			if($listing_type=='select_box'){
				?>
				<option value="<?php echo $value['city_id'];?>"><?php echo $value['city_name'];?></option>
				<?php
			}else if($listing_type=='radio_button'){
				?>
	              <li>
	                <input class="filter cityfilter" type="radio" name="cities" id="radio<?php echo $value['city_id'];?>" value="<?php echo $value['city_id'];?>">
	                <label class="checkbox-label" for="radio<?php echo $value['city_id'];?>"><?php echo $value['city_name'];?> - []</label>
	              </li>
              	<?php
			}			
		}
	}
?>