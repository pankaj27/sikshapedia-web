<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page"></li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">College Search URL Listing Description </h6>
					<form class="forms-sample" id="form_college_url_search_data_edit" autocomplete="off" method="post">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
						<input type="hidden" name="page_id" value="<?php echo encode_data($slug_data->url_id);?>">
						<div class="form-group row">
							<div class="col-md-12">
								<label for="system_meta_title">URL</label>
								<input type="text" class="form-control" value="<?php echo $slug_data->url_value;?>" readonly>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-md-12 table-responsive">
								<label for="system_meta_title">Colleges (Top 30 data needs to be added)</label>
								<div id="div_college_list" class="list-group">
									<?php
									if (!empty($colleges)) {
										$i = 1;
										foreach ($colleges as $key => $value) {
											?>
											<div class="list-group-item">
												<input type="hidden" class="college_id" name="college_id[]" value="<?php echo $value['college_id']; ?>"> 
												<input type="hidden" class="college_order" name="college_order[]" value="<?php echo $i; ?>">   
												<span class="order-number"><?php echo $i; ?></span>&nbsp;&nbsp;
												<img src="<?php echo $value['college_logo']; ?>" width="60" height="60">&nbsp;&nbsp;
												<?php echo $value['college_name']; ?>
											</div>
											<?php
											$i++;
										}
									}
									?>
								</div>

							</div>
						</div>

						<div class="buy-now-wrapper" id="buttons_wrapper">
							<button type="button" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_save_course_details_data">Save Data</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

</div>