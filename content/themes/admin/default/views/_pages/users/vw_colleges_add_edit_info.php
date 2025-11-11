<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/institutions/colleges">Colleges</a></li>
			<li class="breadcrumb-item active" aria-current="page"><?php echo (!empty($college_id))?'Update':'Add';?> College</li>
		</ol>
	</nav>

	<div class="row">
		
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<form id="form_college_info">
						<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
						<input type="hidden" name="college_info_type" value="1">
						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">College Name</label>
									<input type="text" class="form-control" placeholder="Enter name" name="college_name" id="college_name" value="<?php echo (!empty($college_data))?$college_data['college_name']:'';?>">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									
									<textarea class="form-control" name="college_general_info" id="college_general_info" rows="10" >
										<?php
										if(!empty($college_data['college_general_info'])){
											echo $college_data['college_general_info'];
										}
										?>
									</textarea>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_college_general_info">Save</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>

	</div>


</div>

<script type="text/javascript">let _college='<?php echo (!empty($college_data))?$college_data['college_id']:'';?>';</script>