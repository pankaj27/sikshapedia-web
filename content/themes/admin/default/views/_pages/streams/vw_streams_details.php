<div class="page-content">
	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title"><?php echo $stream_data['stream_name'];?> Inner Menus</h6>
					<form id="form_stream_inner_menus">
						<input type="hidden" name="_stream_id" id="_stream_id" value="<?php echo $stream_id;?>">
						<div class="row">
							<div class="col-sm-8">
								<div class="form-group">
									<label class="control-label">Menu Name</label>
									<input class="form-control" placeholder="Enter menu title" name="stream_menu_name" id="stream_menu_name">
								</div>
							</div>
							
						</div>
						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">Menu Title</label>
									<textarea class="form-control" placeholder="Enter menu title" name="stream_menu_title" id="stream_menu_title" rows="2"></textarea>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Fixed Menu Type</label>
									<select class="form-control" name="stream_menu_fixed_type" id="stream_menu_fixed_type">
										<option value="none">None</option>
										<option value="overview">Overview</option>
										<option value="all-courses">All Courses</option>
									</select>
								</div>
							</div>
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">Open Link in New Tab</label>
									<select class="form-control" name="stream_menu_open_new_tab" id="stream_menu_open_new_tab">
										<option value="2">No</option>
										<option value="1">Yes</option>										
									</select>
								</div>
							</div>
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="stream_menu_status" id="stream_menu_status">
										<option value="1">Active</option>
										<option value="2">Deactive</option>
									</select>
								</div>
							</div>
						</div>
						
						<div class="row">
							<div class="col-sm-12">
								<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_stream_menu">Save</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>

		<div class="col-md-12">
			<div class="card">
				<div class="card-body">
					<div class="table-responsive">
						<table class="table" id="table_stream_menu">
							<thead>
								<th>#</th>
								<th>Menu</th>
								<th>Action</th>
							</thead>
							<tbody>
								<?php
								if(!empty($stream_data['stream_menus'])){
									$x=1;
									foreach ($stream_data['stream_menus'] as $key => $value){
										?>
										<tr>
											<td><?php echo $x;?></td>
											<td><a href="<?php echo $value['menu_url'];?>" target="_blank"><?php echo $value['menu_name'];?></a></td>
											<td>
												<div class="btn-group">
													<a href="<?php echo $value['menu_add_details_link'];?>" class="btn btn-xs btn-primary" target="_blank">Add Details</a>
													<button class="btn btn-xs btn-dark btn_edit_stream_inner_menues" data-stream_id="<?php echo $stream_data['stream_id'];?>" data-stream_menu_id="<?php echo $value['menu_id'];?>">Edit Menu</button>
													<button class="btn btn-xs btn-danger btn_delete_stream_inner_menu" data-stream_id="<?php echo $stream_data['stream_id'];?>" data-stream_menu_id="<?php echo $value['menu_id'];?>">Delete</button>
												</div>

											</td>
										</tr>
										<?php
										$x++;
									}
								}
								?>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


<script type="text/javascript"> var p_row='';var loadergif='<?php echo base_url('uploads/app/default/carina_loader_animation.gif');?>';var parent_folder='data';var stream_faq_row='';</script>