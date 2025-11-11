<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<?php
if(!empty($courses)){

	if($selction_type=='checkbox'){
		foreach ($courses as $key => $value) {
			?>
			<div class="col-lg-4">
				<div class="form-group">
				<?php
				foreach ($value as $k => $v) {
					?>
					<input type="checkbox" name="course_streams[]" value="<?php echo $v['course_id'];?>" <?php echo $v['checked'];?>>  <span><?php echo $v['course_name'];?> <?php echo $v['course_short_name'];?><?php echo $v['course_lateral'];?></span><br>
					<?php
				}
				?>
				</div>
			</div>
			<?php						
		}
	}else if($selction_type=='selectbox'){
		foreach ($courses as $key => $value){
			?>
			<option value="<?php echo $value['course_id'];?>" <?php echo $value['selected'];?>><?php echo $value['course_name'];?> <?php echo $value['course_short_name'];?><?php echo $value['course_sub_stream'];?><?php echo $value['course_lateral'];?></option>
			<?php
		}
	}
		
}

?>