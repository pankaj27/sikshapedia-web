<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="profile-content py-4">
	<div class="wrapper">
		<div class="row">
			<div class="col-lg-12 mb-4 mb-lg-0" id="gallery_tabs">
				<div class="card userCard">
					<div class="card-header bg-white">
					  <h5 class="m-0 d-inline">University Informations</h5> <small id="user_type" class="form-text text-muted">You need to update your account type to operate your account.Without updating your account type it will be deactivated.</small>
					</div>
					<div class="card-body">
						
							<form id="form_info_settings" enctype="multipart/form-data">
								<input type="hidden" name="data_type" value="info_settings">
								<div class="row">
								<div class="form-group col-sm-6">
					                <label>Estd. Year</label>
					                <input type="text" class="form-control datepicker" id="registration_estd_year" name="registration_estd_year" aria-describedby="registration_estd_year" placeholder="Enter Estd.Year" value="<?php echo (isset($userdata->user_estd_year))?$userdata->user_estd_year:'';?>">
					            </div>
					            <div class="form-group col-sm-6">
					                <label>University Type</label>
					                <select class="form-control" name="registration_type" id="registration_type">
										<option value="">Select Type</option>
										<?php
										if(!empty($institue_types)){
											foreach ($institue_types as $key => $value) {
												?>
												<option value="<?php echo $value['inst_type'];?>" <?php echo $value['selected'];?>><?php echo $value['inst_type_name'];?></option>
												<?php
											}
										}
										?>
									</select>
					            </div>

					            <div class="form-group col-sm-3">
									<label>University Logo</label>
									<div class="custom-file">
									    <input type="file" class="custom-file-input" id="registration_logo" aria-describedby="registration_logo" name="registration_logo">
									    <label class="custom-file-label" for="registration_logo">Choose Logo</label>
									</div>
								</div>
								<div class="form-group col-sm-9">
									<label>University Banner</label>
									<div class="custom-file">
									    <input type="file" class="custom-file-input" id="registration_banner" name="registration_banner" aria-describedby="registration_banner">
									    <label class="custom-file-label" for="registration_banner">Choose Banner</label>
									</div>
								</div>

								<?php
								if(isset($user_logo) && !empty($user_logo)){
									?>
									<div class="form-group col-sm-3">
										<div class="thumbnail">
									      <a href="<?php echo $user_logo;?>">
									        <img src="<?php echo $user_logo;?>" alt="Lights" style="width:100%">
									      </a>
									    </div>
									</div>
									<?php
								}
								
								if(isset($user_banner) && !empty($user_banner)){
									?>
									<div class="form-group col-sm-9">
										<div class="form-group col-sm-12">
										<div class="thumbnail">
									      <a href="<?php echo $user_banner;?>">
									        <img src="<?php echo $user_banner;?>" alt="Lights" style="width:100%">
									      </a>
									    </div>
									</div>
									</div>
									<?php
								}
								?>

					            <div class="form-group col-sm-12">
					                <label class="d-block">University Affiliation</label>
					                <?php
									if(!empty($affiliation_types)){
										foreach ($affiliation_types as $key => $value) {
											?>
											<div class="form-check form-check-inline">
								                <input class="form-check-input" type="checkbox" name="registration_affiliation_type[]" id="registration_affiliation_type_<?php echo $key;?>" value="<?php echo $value['statutory_body_id'];?>" <?php echo $value['selected'];?>>
								                <label class="form-check-label" for="registration_affiliation_type_<?php echo $key;?>"><?php echo $value['statutory_body_abbr'];?></label>
								            </div>
											<?php
										}
									}
									?>
					            </div>

					            <div class="col-sm-12">
					               <button type="submit" class="btn btn-primary" id="btn_update_info">Update</button>
					            </div>

					            </div>
				            </form>
						
					</div>
				</div>
			</div>
		</div>
	</div>
</div>