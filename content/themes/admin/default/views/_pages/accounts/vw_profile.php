<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">My Profile</li>
		</ol>
	</nav>


	<div class="profile-page tx-13">
		<div class="row profile-body">
			<!-- left wrapper start -->
			<div class="d-none d-md-block col-md-4 col-xl-3 left-wrapper">
				<div class="card rounded">
					<div class="card-body">
						<div class="d-flex align-items-center justify-content-between mb-2">
							<h6 class="card-title mb-0"><?php echo $profile_data['user_fullname'];?></h6>							
						</div>

						<div class="mt-3">
							<label class="tx-11 font-weight-bold mb-0 text-uppercase">Email:</label>
							<p class="text-muted"><?php echo $profile_data['user_email'];?></p>
						</div>
						<div class="mt-3">
							<label class="tx-11 font-weight-bold mb-0 text-uppercase">Phone No:</label>
							<p class="text-muted"><?php echo $profile_data['user_phone_no'];?></p>
						</div>
						<div class="mt-3">
							<label class="tx-11 font-weight-bold mb-0 text-uppercase">User Name:</label>
							<p class="text-muted"><?php echo $profile_data['user_name'];?></p>
						</div>
						<div class="mt-3">
							<label class="tx-11 font-weight-bold mb-0 text-uppercase">Bank Details:</label>
							<p class="text-muted"><?php echo ($profile_data['user_bank_details_added']=='1')?'Updated':'Not Updated';?></p>
						</div>
						<div class="mt-3">
							<label class="tx-11 font-weight-bold mb-0 text-uppercase">Data Upload Quota/month:</label>
							<p class="text-muted"><?php echo $profile_data['user_per_month_upload_quota'];?></p>
						</div>
						<div class="mt-3">
							<label class="tx-11 font-weight-bold mb-0 text-uppercase">Data Upload Amount/upload:</label>
							<p class="text-muted">₹<?php echo $profile_data['user_per_upload_amount'];?></p>
						</div>
					</div>
				</div>
			</div>
		
			<div class="col-md-8 col-xl-9 middle-wrapper">
				<div class="row">
					<div class="col-md-12 grid-margin">
						<div class="card rounded">
							<div class="card-header">
								<div class="d-flex align-items-center justify-content-between">
									<div class="d-flex align-items-center">
										<img class="img-xs rounded-circle" src="<?php echo $profile_data['user_image'];?>" alt="">													
										<div class="ml-2">
											<h6 class="card-title mb-0">Bank Details & Photo</h6>
										</div>
									</div>
								</div>
							</div>
							<form id="form_profile">
								<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
								<input type="hidden" name="update_type" value="profile_data">
								<div class="card-body">
									<div class="row">
										<p class="alert alert-info">
											<?php
											if($profile_data['user_bank_details_added']=='1'){
												?>
												Hi <?php echo $profile_data['user_fullname'];?>,your per month data upload quota and amount of per upload is mentioned here.You need to upload all data of a college  and it will be verified and amount will be calculated and reflect on your account.
												<?php
											}else{
												?>
												Hi <?php echo $profile_data['user_fullname'];?>,You need to update your bank details.Your per month data upload quota and amount of per upload is mentioned here.You need to upload all data of a college and it will be verified and amount will be calculated and reflect on your account.
												<?php
											}
											?>
										</p>
										<p class="alert alert-danger">
											<strong>Note:If the per day quota is not fullfilled then the amount will not be calculated for that day.</strong>
										</p>
									</div>
									<div class="row">
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">Account holder name</label>
												<input type="text" class="form-control" placeholder="Enter Name" name="profile_bank_acc_name" id="profile_bank_acc_name" value="<?php echo ($profile_data['user_bank_acc_name']!='')?$profile_data['user_bank_acc_name']:$profile_data['user_fullname'];?>">
											</div>
										</div>
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">Phone No</label>
												<input type="text" class="form-control" placeholder="Enter Name" name="profile_phone_no" id="profile_bphone_no" value="<?php echo $profile_data['user_phone_no'];?>">
											</div>
										</div>
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">Bank Account No</label>
												<input type="text" class="form-control" placeholder="Enter Account No" name="profile_bank_acc" id="profile_bank_acc" value="<?php echo $profile_data['user_bank_acc'];?>">
											</div>
										</div>
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">Bank Name</label>
												<input type="text" class="form-control" placeholder="Enter Bank Name" name="profile_bank_name" id="profile_bank_name" value="<?php echo $profile_data['user_bank_name'];?>">
											</div>
										</div>										
									</div>
									<div class="row">
										<div class="col-sm-4">
											<div class="form-group">
												<label class="control-label">Bank IFSC</label>
												<input type="text" class="form-control" placeholder="Enter Bank IFSC" name="profile_bank_ifsc" id="profile_bank_ifsc" value="<?php echo $profile_data['user_bank_ifcs'];?>">
											</div>
										</div>
										<div class="col-sm-8">
											<div class="form-group">
												<label>My Photo</label>
												<input type="file" name="profile_photo" class="file-upload-default">
												<div class="input-group col-xs-12">
													<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
													<span class="input-group-append">
														<button class="file-upload-browse btn btn-primary" type="button">Browse Inage</button>
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="card-footer">
									<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_profile_data">Save</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>			
		</div>
   	</div>

</div>