
<div class="row">
	<div class="col-lg-12">
		<div class="card userCard" style="border:none !important;">
			<form id="from_student_prof_exp_details">

				<div class="card-header bg-white text-center" style="border:none !important;"><h4 class="m-0 d-inline">PROFESSIONAL EXPERIENCE</h4></div>
				<div class="card-body" id="prof_exp_div">
				<?php $table_row=0;?>
				<?php
				if(!empty($prof_details_found)){
					foreach ($prof_details_found as $key => $value) {
						?>
						<div class="row prof_exp_row<?php echo $table_row;?>">
							<div class="form-group col-sm-12">
					            <label>Select A Company </label>
					            <?php
					            if($table_row>0){
					            	?>
									<button type="button" class="btn btn-sm btn-danger" style="float:right;" onclick="$('.prof_exp_row<?php echo $table_row;?>').remove()">Remove</button>
					            	<?php
					            }
					            ?>					            
					            <select class="form-control companies" name="prof_exp[<?php echo $table_row;?>][company]">
					            	<option value="0">Select Company</option>
					            </select>
					        </div>
					    </div>
					    <div class="row">
					    	<div class="form-group col-sm-12" style="display:none;">
					    		<label>Other Company</label>
					    		<input type="text" name="prof_exp[<?php echo $table_row;?>][other_company]" class="form-control" value="<?php echo $value->exp_company_name;?>">
					    	</div>
					    </div>
					    <div class="row">
					        <div class="form-group col-sm-12">
				                <label>Work Exprerience (in Years) </label>
				                <select class="form-control" name="prof_exp[<?php echo $table_row;?>][exp_year]">
					            	<option value="0">Select Experienc</option>
					            	<?php
					            	foreach ($years as $k => $v) {
					            		?>
					            		<option value="<?php echo $k;?>" <?php echo ($value->exp_year==$v)?'selected':'';?>><?php echo $v;?></option>
					            		<?php
					            	}
					            	?>
					            </select>
				            </div>
				        </div>
				        <div class="row">
				            <div class="form-group col-sm-12">
					            <label>Specialization </label>
					            <textarea class="form-control"  name="prof_exp[<?php echo $table_row;?>][specialization]" placeholder="Specialization" rows="3"><?php echo $value->exp_specializations;?></textarea>
					        </div>
					    </div>
						<?php

						$table_row++;
					}
				}else{
					?>
					<div class="row">
						<div class="form-group col-sm-12">
				            <label>Select A Company </label>
				            <select class="form-control companies" name="prof_exp[<?php echo $table_row;?>][company]">
				            	<option value="0">Select Company</option>
				            </select>
				        </div>
				    </div>
				    <div class="row">
				    	<div class="form-group col-sm-12" style="display:none;">
				    		<label>Other Company</label>
				    		<input type="text" name="prof_exp[<?php echo $table_row;?>][other_company]" class="form-control">
				    	</div>
				    </div>
				    <div class="row">
				        <div class="form-group col-sm-12">
			                <label>Work Exprerience (in Years) </label>
			                <select class="form-control" name="prof_exp[<?php echo $table_row;?>][exp_year]">
				            	<option value="0">Select Experienc</option>
				            	<?php
				            	foreach ($years as $key => $value) {
				            		?>
				            		<option value="<?php echo $key;?>"><?php echo $value;?></option>
				            		<?php
				            	}
				            	?>
				            </select>
			            </div>
			        </div>
			        <div class="row">
			            <div class="form-group col-sm-12">
				            <label>Specialization </label>
				            <textarea class="form-control"  name="prof_exp[<?php echo $table_row;?>][specialization]" placeholder="Specialization" rows="3"></textarea>
				        </div>
				    </div>
					<?php
				}

				?>				
					
					
				</div>
				<div class="card-footer bg-white" style="border:none !important;">
					<div class="row">
					    <div class="form-group col-sm-12">
					    	<button type="submit" class="btn btn-primary" id="btn_update_prof_exp_info" style="float:right;">Update</button>
					    	<button type="button" class="btn btn-warning" id="btn_add_company" style="float:right;">Add Company</button>
					    </div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<script type="text/javascript">
	var prof_exp_row='<?php echo ($table_row>0)?$table_row:($table_row+1);?>';
	var years_row='';

	<?php	
	foreach ($years as $key => $value) {
		?>
		years_row+='<option value="<?php echo $key;?>"><?php echo $value;?></option>';
		<?php
	}
	?>
</script>