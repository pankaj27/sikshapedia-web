
<form id="form_college_quick_upload2">
    <div class="modal-body">	            	
		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		<input type="hidden" name="_college_id" id="_college_id" value="<?php echo $college_data->college_user_id;?>">
		<input type="hidden" name="college_type" id="college_type" value="<?php echo $college_data->college_utype;?>">


		<div class="row">
			<div class="col-md-4">
				<div class="form-group">
					<label>College Country</label>
					<select class="form-control" name="college_country" id="college_country">
						<?php
						foreach ($countries as $key => $value) {
							?>
							<option value="<?php echo $value['country_id'];?>" <?php echo $value['selected'];?>><?php echo $value['country_name'];?></option>
							<?php
						}
						?>
					</select>
				</div>
			</div>
			<div class="col-md-4">
    				<div class="form-group">
    					<label>University State</label>
    					<select class="form-control" name="college_state" id="college_state">
    						<?php
							foreach ($states as $key => $value) {
								?>
								<option value="<?php echo $value['state_id'];?>" <?php echo $value['selected'];?>><?php echo $value['state_name'];?></option>
								<?php
							}
							?>
    					</select>
    				</div>
    			</div>
    			<div class="col-md-4">
    				<div class="form-group">
    					<label>University City</label>
    					<select class="form-control" name="college_city" id="college_city">
    						<?php
							foreach ($cities as $key => $value) {
								?>
								<option value="<?php echo $value['city_id'];?>" <?php echo $value['selected'];?>><?php echo $value['city_name'];?></option>
								<?php
							}
							?>
    					</select>
    				</div>
    			</div>
		</div>
        		
		<div class="row">
        	<div class="col-md-9">
        		<div class="form-group">
					<label>College Name</label>
					<input type="text" class="form-control" placeholder="College Name" name="college_name" id="college_name" value="<?php echo $college_data->college_name;?>">
				</div>
			</div>
			<div class="col-md-3">
        		<div class="form-group">
					<label>College Short Name</label>
					<input type="text" class="form-control" placeholder="College Name" name="college_short_name" id="college_short_name" value="<?php echo $college_data->college_short_name;?>">
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
        		<div class="form-group">
					<label>College Email</label>
					<input type="text" class="form-control" placeholder="Enter official email" name="college_email" id="college_email" value="<?php echo $college_data->college_email;?>">
				</div>
			</div>
			<div class="col-md-3">
        		<div class="form-group">
					<label>College Phone No.</label>
					<input type="text" class="form-control" placeholder="Enter official phone no." name="college_phone" id="college_phone" value="<?php echo $college_data->college_phone_no;?>">
				</div>
			</div>
			<div class="col-md-3">
        		<div class="form-group">
					<label>College Estd. Year</label>
					<input type="text" class="form-control" placeholder="Enter Estd. Year" name="college_estd" id="college_estd" value="<?php echo $college_data->college_estd_year;?>">
				</div>
			</div>
			<div class="col-md-3">
				<div class="form-group">
					<label class="control-label">Pincode</label>
					<input type="text" class="form-control" placeholder="College pincode" name="college_pincode" value="<?php echo $college_data->college_pincode;?>">
				</div>
			</div>
		</div>
		<div class="row">							
			<div class="col-md-12">
				<div class="form-group">
					<label class="control-label">Address</label>
					<textarea class="form-control" rows="3" placeholder="College Address" name="college_address"><?php echo $college_data->college_addres;?></textarea>
				</div>
			</div>							
		</div>
		<div class="row">
			<div class="col-md-6">
				<div class="form-group">
					<label>College Logo</label>
					<input type="file" name="college_logo" class="file-upload-default">
					<div class="input-group col-xs-12">
						<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="" id="college_logo_name">
						<span class="input-group-append">
							<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
						</span>
					</div>
				</div>
			</div>
			<div class="col-md-6">
				<div class="form-group">
					<label>College Banner</label>
					<input type="file" name="college_banner" class="file-upload-default">
					<div class="input-group col-xs-12">
						<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Banner" value="" id="college_banner_name">
						<span class="input-group-append">
							<button class="file-upload-browse btn btn-primary" type="button">Browse Banner</button>
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-md-3">
				<div class="form-group">
					<label>College is Featured</label>
					<select class="form-control" name="college_is_featured" id="college_is_featured">
						<option value="2">No</option>
						<option value="1">Yes</option>
					</select>
				</div>
			</div>

			<div class="col-md-3">
				<div class="form-group">
					<label>College Visible in Search Result Grid</label>
					<select class="form-control" name="college_is_visible_in_search" id="college_is_visible_in_search">
						<option value="1">Yes</option>
						<option value="2">No</option>									
					</select>
				</div>
			</div>

			<div class="col-md-3">
				<div class="form-group">
					<label>College Show in Home Page as Top College</label>
					<select class="form-control" name="college_is_top_college" id="college_is_top_college">
						<option value="2">No</option>
						<option value="1">Yes</option>
					</select>
				</div>
			</div>
			<div class="col-md-3">
				<div class="form-group">
					<label>Admin Verified</label>
					<select class="form-control" name="college_admin_verified" id="college_admin_verified">
						<option value="2">No</option>
						<option value="1">Yes</option>
					</select>
				</div>
			</div>
		</div>
    	
    </div>
    <div class="modal-footer">	            	
        <button type="submit" class="btn btn-primary" id="btn_update_college_quick">Update</button>
    </div>
</form>

<script type="text/javascript">
	$(document).ready(function(){
		$("#college_country").chosen({no_results_text: "Select Country"});
		$("#college_state").chosen({no_results_text: "Select State"});
		$("#college_city").chosen({no_results_text: "Select City"});




	 	$('.file-upload-browse').on('click', function(e) {
	      var file = $(this).parent().parent().parent().find('.file-upload-default');
	      file.trigger('click');
	  	});
		  $('.file-upload-default').on('change', function() {
		    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
		  });



		    $('#form_college_quick_upload2').validate({
				rules:{
					college_name:{
				        required:true
				    },
				}
			});
	});
</script>