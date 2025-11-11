<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="card userCard">
	<div class="card-header bg-white">
	  <h5 class="m-0 d-inline">Ranking Informations</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
	</div>
	<div class="card-body">
		<div class="row">
			<input type="hidden" name="data_type" value="ranking_settings">

			<div class="form-group col-sm-12">
				<label>University Ranking General Info</label>
				<div class="summernote"></div>
			</div>

			<div class="form-group col-sm-12">
            	<label>University Ranks</label>
            	<?php 
            	if(!empty($ranking_types)){
            		?>
            		<div class="table-responsive">
            			<table class="table">
            				<thead>
            					<th>Ranking</th>
            					<th>Year</th>
            					<th>Ranked At</th>
            					<th>Ranked Out of</th>
            				</thead>
            				<tbody>
            					<?php
								foreach ($ranking_types as $key => $value) {
			            			?>
			            			<tr>
			            				<td><?php echo $value['rank_body'];?></td>
			            				<td>
			            					<select class="">
			            						<?php
			            						for ($i=$years_5_back;$i<=$current_year;$i++) {
			            							?>
			            							<option class="<?php echo $i;?>"><?php echo $i;?></option>
			            							<?php
			            						}
			            						?>
			            					</select>
			            				</td>
			            				<td><input type="text" class="" id="registration_estd_year" name="registration_estd_year" aria-describedby="registration_estd_year" placeholder="Enter Estd.Year" value="<?php echo $value['rank_value'];?>" readonly="true"></td>
			            				<td><input type="text" class="" id="registration_estd_year" name="registration_estd_year" aria-describedby="registration_estd_year" placeholder="Enter Estd.Year" value="<?php echo $value['rank_value'];?>" readonly="true"></td>
			            			</tr>
			            			<?php
			            		}
            					?>
            				</tbody>
            			</table>
            		</div>
            		<?php
            	}
            	?>
            </div>

            

            <div class="col-sm-12">
               <button type="submit" class="btn btn-primary" id="btn_update_account">Update</button>
            </div>
		</div>
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function(){
		 $('.summernote').summernote({
		 	height: 250,
		 	toolbar: [
			    // [groupName, [list of button]]
			    ['style', ['bold', 'italic', 'underline', 'clear']],
			    ['fontsize', ['fontsize']],
			    ['color', ['color']],
			    ['para', ['ul', 'ol', 'paragraph']]
			]
		 });
	});
</script>