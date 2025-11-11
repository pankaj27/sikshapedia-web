<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Create Campaign Posts</li>
		</ol>
	</nav>

	<form id="form_campaign_add_edit_new">
		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		<input type="hidden" name="campaign_id" id="campaign_id" value="<?php echo (!empty($campaign_data))?$campaign_data->campaign_id:'';?>">

		<div class="row">
			<div class="col-md-7 grid-margin stretch-card">
				<div class="card">
					<div class="card-body">
						<h6 class="card-title">Campaign</h6>
						<div class="col-md-12">
							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Campaign Name</label>
										<input type="text" name="campaign_name" id="campaign_name" class="form-control" placeholder="Add Campaign name" value="<?php echo (!empty($campaign_data))?$campaign_data->campaign_name:'';?>">
									</div>
								</div>
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Campaign Subject</label>
										<input type="text" name="campaign_subject" id="campaign_subject" class="form-control" placeholder="Add Campaign Subject" value="<?php echo (!empty($campaign_data))?$campaign_data->campaign_subject:'';?>">
									</div>
								</div>
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Campaign Start</label>
										<input type="text" name="campaign_start" id="campaign_start" class="form-control" placeholder="Add Campaign Start date" value="<?php echo (!empty($campaign_data))?$campaign_data->campaign_start:'';?>">
									</div>
								</div>
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Campaign End</label>
										<input type="text" name="campaign_end" id="campaign_end" class="form-control" placeholder="Add Campaign End Date" value=" <?php echo (!empty($campaign_data))?$campaign_data->campaign_end:'';?>">
									</div>
								</div>
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Campaign Streams</label>
										<input type="text" name="campaign_end" id="campaign_end" class="form-control" placeholder="Add Campaign End Date" value=" <?php echo (!empty($campaign_data))?$campaign_data->campaign_end:'';?>">

										<select class="form-control" name="campaign_stream" id="campaign_stream">
											<?php
											if(!empty($campaign_sreams)){
												foreach ($campaign_sreams as $key => $value) {
													?>
													<option value="<?php echo $value->stream_id;?>" <?php echo ($value->stream_id==$campaign_data->campaign_stream)?'selected':'';?>><?php echo $value->stream_name;?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
								</div>
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Campaign Schedule Time</label>
										<input type="text" name="campaign_schedule_time" id="campaign_schedule_time" class="form-control" placeholder="Campaign Schedule Time" value="">
									</div>
								</div>
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Campaign Fire Frequency</label>
										<input type="number" name="campaign_fire_frequency" id="campaign_fire_frequency" class="form-control" placeholder="Add Campaign fire frequency" value="1" min="1" max="4">
									</div>
								</div>
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Campaign Status</label>
										<select class="form-control" name="campaign_status" id="campaign_status">
											<option value="active" <?php echo (!empty($campaign_data) && ($campaign_data->campaign_status=='active'))?'selected':'';?>>Active</option>
											<option value="inactive" <?php echo (!empty($campaign_data) && ($campaign_data->campaign_status=='inactive'))?'selected':'';?>>Inactive</option>
										</select>
									</div>
								</div>

								<?php

								if(!empty($campaign_variables)){

									foreach ($campaign_variables as $key => $value) {
										foreach ($value as $k => $v){
											?>
											<div class="col-sm-12">
												<div class="form-group">
													<label class="control-label"><?php echo ucwords(str_replace("_"," ",$k));?></label>
													<input type="hidden" name="campaign_variabales[<?php echo $k;?>][name]" id="campaign_variabales_<?php echo $k;?>_name" value="<?php echo $v;?>">
													<input type="text" name="campaign_variabales[<?php echo $k;?>][val]" id="campaign_variabales_<?php echo $k;?>_val" class="form-control" placeholder="<?php echo ucwords(str_replace("_"," ",$k));?>" value="<?php echo $v;?>">
												</div>
											</div>
											<?php
										}										
									}
								}else{
									if(!empty($template_variables)){

										foreach ($template_variables as $key => $value) {
											?>
											<div class="col-sm-12">
												<div class="form-group">
													<label class="control-label"><?php echo ucwords(str_replace("_"," ",$value));?></label>
													<input type="hidden" name="campaign_variabales[<?php echo $key;?>][name]" id="campaign_variabales_<?php echo $key;?>_name" value="<?php echo $value;?>">
													<input type="text" name="campaign_variabales[<?php echo $key;?>][val]" id="campaign_variabales_<?php echo $key;?>_val" class="form-control" placeholder="<?php echo ucwords(str_replace("_"," ",$value));?>" value="">
												</div>
											</div>
											<?php
										}
									}
								}

								?>

								<div class="col-sm-12">
									<div class="form-group">
										<button class="btn btn-primary" type="submit" id="btn_add_campaign"><?php echo (!empty($campaign_data))?'Update Campaign':'Create Campaign';?></button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-md-5 grid-margin stretch-card">
				<div class="col-sm-12">
					<div class="card">
						<div class="card-body">
							<div class="form-group">
								<label class="control-label">Campaign Templates</label>
								<select class="form-group" name="campaign_template">
									<option value="1" <?php echo (!empty($campaign_data) && ($campaign_data->campaign_template=='1'))?'selected':'';?>><?php echo $template_data->template_name;?></option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>

</div>