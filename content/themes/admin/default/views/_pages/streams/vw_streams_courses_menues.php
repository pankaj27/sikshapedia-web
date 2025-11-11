ac<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page"><?php echo $course_data->course_name;?> Menues List-<?php echo $course_data->course_id;?></li>
		</ol>
	</nav>


	<div class="row">

		<?php
		//if(isset($slug_data)){
			?>
			<div class="col-md-12 grid-margin stretch-card">
				<div class="card">
					<div class="card-body">
						<h6 class="card-title">Inner Menus >> <a href="<?php echo (isset($exam_data['exam_link']))?$exam_data['exam_link']:'';?>" target="_blank"><?php echo $course_data->course_name;?></a>  <a href="<?php echo $this->data['admin_base_url'];?>/streams/courses/menues/<?php echo encode_data($course_id);?>" class="btn btn-xs btn-primary" style="float:right;">Back</a></h6>
						
						<form id="form_course_inner_menus">
							<input type="hidden" name="_course" id="_course" value="<?php echo $course_id;?>">
							<input type="hidden" name="_course_menu" id="_course_menu" value="<?php echo $course_menu_id;?>">
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">

							<div class="row">
								<div class="col-sm-8">
									<div class="form-group">
										<label class="control-label">Menu Name</label>
										<input class="form-control" placeholder="Enter menu title" name="course_menu_name" id="course_menu_name" value="<?php echo (isset($menu_data) && !empty($menu_data))?$menu_data->menu_name:'';?>">
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label class="control-label">Parent Menu</label>
										<select class="form-control" name="course_parent_menu" id="course_parent_menu">
											<option value="0">None</option>
											<?php
											if(!empty($exam_data['exam_menus'])){
												foreach ($exam_data['exam_menus'] as $key => $value) {
													?>
													<option value="<?php echo $value['menu_id'];?>"><?php echo $value['menu_name'];?></option>
													<?php
												}
											}
											?>
										</select>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Menu Title</label>
										<textarea class="form-control" placeholder="Menu Title" name="course_menu_title" id="course_menu_title" rows="2"><?php echo (isset($slug_data) && !empty($slug_data))?$slug_data->url_meta_title:'';?></textarea>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Page Heading</label>
										<textarea class="form-control" placeholder="Page Heading" name="course_menu_page_heading" id="course_menu_page_heading" rows="2"><?php echo (isset($slug_data) && !empty($slug_data))?$slug_data->url_page_heading:'';?></textarea>
									</div>
								</div>
							</div>


							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Menu Page Sub Heading</label>
										<textarea class="form-control" placeholder="Menu Page Sub Heading" name="course_menu_sub_title" id="course_menu_sub_title" rows="2"><?php echo (isset($slug_data) && !empty($slug_data))?$slug_data->url_page_sub_heading:'';?></textarea>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Menu Meta Description</label>
										<textarea class="form-control" placeholder="Menu Meta Description" name="course_menu_description" id="course_menu_description" rows="3"><?php echo (isset($slug_data) && !empty($slug_data))?$slug_data->url_meta_desc:'';?></textarea>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label">Menu Page Keywords</label>
										<input class="form-control" placeholder="Menu Page Keywords" name="course_menu_keywords" id="course_menu_keywords" value="<?php echo (isset($slug_data) && !empty($slug_data))?$slug_data->url_meta_key_words:'';?>">
									</div>
								</div>
							</div>

							<div style="border: 2px solid #e0f6f6;border-radius: 10px;padding: 20px;margin-bottom: 20px;">

								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label">Menu Page Structured Data Headline</label>
											<input class="form-control" placeholder="Menu Page Keywords" name="course_strcut_data_headline" id="course_strcut_data_headline" value="<?php echo (isset($slug_type_json_meta_data) && !empty($slug_type_json_meta_data))?$slug_type_json_meta_data->headline:'';?>">
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label">Menu Page Structured Data Description</label>
											<textarea class="form-control" placeholder="Description" name="course_strcut_data_desc" id="course_strcut_data_desc" rows="5"><?php echo (isset($slug_type_json_meta_data) && !empty($slug_type_json_meta_data))?$slug_type_json_meta_data->description:'';?></textarea>
										</div>
									</div>
								</div>


								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label">Menu Page Structured Data Article Body</label>
											<textarea class="form-control" placeholder="Article Body" name="course_strcut_data_body" id="course_strcut_data_body" rows="25"><?php echo (isset($slug_type_json_meta_data) && !empty($slug_type_json_meta_data))?$slug_type_json_meta_data->articleBody:'';?></textarea>
										</div>
									</div>
								</div>
							</div>


							<div class="row">
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Fixed Menu Type</label>
										<select class="form-control" name="course_menu_type" id="course_menu_fixed_type">
											<option value="none"  <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_fixed_type=='none'))?'selected':'';?>>None</option>
											<option value="overview" <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_fixed_type=='overview'))?'selected':'';?>>Overview</option>
											<option value="news"  <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_fixed_type=='news'))?'selected':'';?>>News</option>
											<option value="college_predictor" <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_fixed_type=='college_predictor'))?'selected':'';?>>College Predictor</option>
											<option value="participating_colleges" <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_fixed_type=='participating_colleges'))?'selected':'';?>>Participating Colleges</option>
										</select>
									</div>
								</div>
								<div class="col-sm-2">
									<div class="form-group">
										<label class="control-label">Open Link in New Tab</label>
										<select class="form-control" name="course_menu_open_new_tab" id="course_menu_open_new_tab">
											<option value="2" <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_open_new_tab=='2'))?'selected':'';?>>No</option>
											<option value="1" <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_open_new_tab=='1'))?'selected':'';?>>Yes</option>										
										</select>
									</div>
								</div>
								<div class="col-sm-2">
									<div class="form-group">
										<label class="control-label">Status</label>
										<select class="form-control" name="course_menu_status" id="course_menu_status">
											<option value="1" <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_is_active=='1'))?'selected':'';?>>Active</option>
											<option value="2" <?php echo (isset($menu_data) && !empty($menu_data) && ($menu_data->menu_is_active=='2'))?'selected':'';?>>Deactive</option>
										</select>
									</div>
								</div>
							</div>
							
							<div class="row">
								<div class="col-sm-12">
									<button class="btn btn-outline-primary btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_course_menu">Save</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<?php
		//}

		?>

		

		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Menues <button type="button" class="btn btn-xs btn-primary" style="float:right;" id="btn_course_menu_add" data-toggle="modal" data-target="#courseMenuesModal" data-course_id="<?php echo encode_data($course_data->course_id);?>">Add Menu</button></h6>


					<div class="col-md-12">
						<div class="alert alert-info">
							<p><strong>Note:</strong>To change the menus order move the menu row up or down.</p>
						</div>
					</div>

					<div class="col-md-12">
						<div class="card">
							<div class="card-body">
								<div class="table-responsive">
									<table class="table table-condensed table-sortable sortable-container" id="table_exam_menu">
										<thead>
											<th>#</th>
											<th>Menu</th>
											<th>Child Menu</th>
											<th>Status</th>
											<th>Action</th>
											<th></th>
											<th><!-- <button type="button" class="btn btn-warning btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#practicePaperUploadModal">Add Practice Papers</button> --></th>
										</thead>
										<tbody>
											<?php
											if(!empty($course_menues)){
												$x=0;
												foreach ($course_menues as $key => $value){
													?>
													<tr class="sortable-item" data-id="<?php echo $value['menu_id'];?>">
														<td><i class="mdi mdi-cursor-move"></i> <?php echo $value['menu_serial'];?>-<?php echo $value['menu_id'];?></td>
														<td>

															<?php
															if(!empty($value['menu_link'])){
																?>
																<a href="<?php echo $value['menu_link'];?>" target="_blank"><strong><?php echo $value['menu_name'];?></strong></a>
																<?php
															}else{
																?>
																<strong><?php echo $value['menu_name'];?></strong><br>
																<span>SEO Link & Menu Link Not Generated Yet</span>
																<?php
															}

															?>
															

														</td>
														
														<td>

															<?php
															if(!empty($value['child_menu'])){
																?>
																<button type="button" class="btn btn-xs btn-danger" data-toggle="collapse" data-target="#collapseme<?php echo $value['menu_id'];?>" class="accordion-toggle" data-menu_id="<?php echo $value['menu_id'];?>">Child Menues</button>
																<?php
															}else{
																?>
																<span class="btn btn-xs btn-dark">None</span>
																<?php
															}
															?>


														</td>

														<td>
															<?php
															if($value['menu_is_active']=='1'){
																?>
																<span class="btn btn-xs btn-success">Active</span>
																<?php
															}else if($value['menu_is_active']=='2'){
																?>
																<span class="btn btn-xs btn-dark">Deactive</span>
																<?php
															}

															?>
														</td>


														<td><a href="<?php echo $value['menu_add_details_link'];?>" class="btn btn-xs btn-primary">Add Details</a></td>
														<td><a href="<?php echo $value['menu_edit_link'];?>" class="btn btn-xs btn-primary">Edit Menu</a></td>
														<td><button type="button" class="btn btn-xs btn-danger btn_del_exam_details_menu" data-menu_id="<?php echo $value['menu_id'];?>">Delete Menu</button></td>	
														<td>
															<?php
															

															?>
															<button type="button" class="btn btn-xs btn-dark btn_add_menu_widget" data-exam_id="<?php echo $course_id;?>" data-menu_name="<?php echo $value['menu_name'];?>" data-menu_id="<?php echo $value['menu_id'];?>" data-target="#coursemenuWidgetAddModal" data-toggle="modal">Add Widget</button>
															<button type="button" class="btn btn-xs btn-success btn_add_to_parent_menu" data-exam_id="<?php echo $course_id;?>" data-exam_menu_id="<?php echo $value['menu_id'];?>">Add to Parent Menu</button>
														</td>										
													</tr>
													
													<?php
													if(!empty($value['child_menu'])){
														?>
														<tr>
															<td class="hiddenRow" colspan="7">
																<div class="col-md-12 accordian-body collapse" id="collapseme<?php echo $value['menu_id'];?>" style="margin-top:10px;margin-bottom:10px;">
																
																	<table>
																		<tbody>
																			<?php
																			$zx=1;
																			foreach ($value['child_menu'] as $k => $v) {
																				?>
																				<tr>
																					<td><?php echo $zx;?></td>
																					<td><?php echo $v['menu_name'];?></td>
																					<td><?php echo $v['menu_show_in_exam_list'];?></td>
																					<td><a href="<?php echo $v['menu_add_details_link'];?>" class="btn btn-xs btn-primary" target="_blank">Add Details</a></td>
																					<td><a href="<?php echo $v['menu_edit_link'];?>" class="btn btn-xs btn-primary">Edit Menu</a></td>
																					<td><button type="button" class="btn btn-xs btn-danger btn_del_exam_details_menu"  data-menu_id="<?php echo $v['menu_id'];?>">Delete Menu</button></td>
																					<td>
																						<button type="button" class="btn btn-xs btn-dark btn_add_menu_widget" data-exam_id="<?php echo $exam_id;?>" data-menu_name="<?php echo $v['menu_name'];?>" data-menu_id="<?php echo $v['menu_id'];?>" data-target="#coursemenuWidgetAddModal" data-toggle="modal">Add Widget</button>
																						<button type="button" class="btn btn-xs btn-danger btn_remove_parent_menu" data-exam_id="<?php echo $course_data->course_id;?>" data-exam_menu_id="<?php echo $v['menu_id'];?>">Remove Parent Menu</button>
																					</td>
																				</tr>
																				<?php
																				$zx++;
																			}
																			?>
																		</tbody>
																	</table>
																</div>
															</td>
														</tr>
														<?php
													}
														
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



					<!-- <div class="table-responsive">
						<table class="table" id="courses_menues_list_table">
							<thead>
		                      <tr>
		                        <th>Menu</th>
		                        <th>Action</th>
		                      </tr>
		                    </thead>
		                    <tbody>
		                    </tbody>
						</table>
					</div> -->
				</div>
			</div>
		</div>
	</div>


	<div class="modal fade bd-example-modal-xl" id="courseMenuesModal" tabindex="-1" role="dialog" aria-labelledby="courseMenuesModal" aria-hidden="true">
	    <div class="modal-dialog modal-xl" role="document">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="courseMenuesModal">Menu</h5>
	                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	            </div>	            
            	<form id="form_courses_menyu">
	            	<input type="hidden" name="course_id" id="course_id" value="">
	            	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            <div class="modal-body">
	            		<div class="row">
	            			<div class="col-md-8">
	            				<label class="control-label">Menu Name</label>
		            			<input type="text" class="form-control" id="course_menu_name" name="course_menu_name" placeholder="Menu name">
		            		</div>
		            		<div class="col-md-4">
		            			<label class="control-label">Parent Menu</label>
		            			<select class="form-control" name="course_parent_menu" id="course_parent_menu">
		            				<option value="">Select Parent Menu</option>
		            				<?php
		            				if(!empty($course_parent_menues)){
		            					foreach ($course_parent_menues as $key => $value) {
		            						?>
		            						<option value="<?php echo $value['menu_id'];?>"><?php echo $value['menu_name'];?></option>
		            						<?php
		            					}
		            				}
		            				?>
		            			</select>
		            		</div>
	            		</div>
	            		<div class="row">
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Fixed Menu Type</label>
									<select class="form-control valid" name="course_menu_fixed_type" id="course_menu_fixed_type" aria-invalid="false">
										<option value="none">None</option>
										<option value="overview">Overview</option>
										<option value="news">News</option>
										<option value="college_predictor">College Predictor</option>
										<option value="participating_colleges">Participating Colleges</option>
										<option value="jobs">Jobs</option>
									</select>
								</div>
							</div>
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">Open Link in New Tab</label>
									<select class="form-control" name="course_menu_open_new_tab" id="course_menu_open_new_tab">
										<option value="2">No</option>
										<option value="1">Yes</option>										
									</select>
								</div>
							</div>
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="course_menu_status" id="course_menu_status">
										<option value="1">Active</option>
										<option value="2">Deactive</option>
									</select>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-md-12">
								<label class="control-label">Menu Page Title</label>
		            			<input type="text" class="form-control" id="course_menu_page_title" name="course_menu_page_title" placeholder="Menu page Title">
							</div>
						</div>  	
		            </div>
		            <div class="modal-footer">
		                <button type="submit" class="btn btn-primary" id="btn_add_course_menu">Add Menu</button>
		            </div>
	            </form>
	        </div>
	    </div>
	</div>


	<div class="modal fade bd-example-modal-xl" id="editCourseMenuMetaModal" tabindex="-1" role="dialog" aria-labelledby="editCourseMenuMetaModal" aria-hidden="true">
	    <div class="modal-dialog modal-xl" role="document">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="editCourseMenuMetaModalTitle">Edit Course Menu Meta</h5>
	                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	            </div>
	            <form id="form_course_menu_meta">
		            <div class="modal-body">	            	
		            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            		<input type="hidden" name="_course" id="_course" value="">
		            		<input type="hidden" name="_course_menu" id="_course_menu" value="">
							<div class="row">
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Course Menu Page URL (Auto Generated)</label>
										<input type="text" class="form-control" placeholder="Enter page heading" id="course_menu_page_url" readonly="true">
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Course Menu Page Heading (Auto Generated)</label>
										<input type="text" class="form-control" placeholder="Enter page heading" name="course_menu_page_heading" id="course_menu_page_heading">
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Course Menu Meta Title (Auto Generated)</label>
										<input type="text" class="form-control" placeholder="Enter meta title" name="course_menu_meta_title" id="course_menu_meta_title">
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Course Menu Meta Keywords (Auto Generated)</label>
										<textarea class="form-control" placeholder="Enter meta keys" name="course_menu_meta_keywords" id="course_menu_meta_keywords" rows="3"></textarea>
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Course Menu Meta Desc (Auto Generated)</label>
										<textarea class="form-control" placeholder="Enter meta desc" name="course_menu_meta_desc" id="course_menu_meta_desc" rows="5"></textarea>
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Course Menu OG Title (Auto Generated)</label>
										<input type="text" class="form-control" placeholder="Enter og title" name="course_menu_og_title" id="course_menu_og_title">
									</div>
								</div>
								<div class="col-md-12">
				            		<div class="form-group">
										<label>Course Menu OG Desc (Auto Generated)</label>
										<textarea class="form-control" placeholder="Enter og description" name="course_menu_og_desc" id="course_menu_og_desc" rows="5"></textarea>
									</div>
								</div>
							</div>
		            	
		            </div>
		            <div class="modal-footer">	            	
		                <button type="submit" class="btn btn-primary" id="btn_update_course_menu_meta">Update</button>
		            </div>
	            </form>
	        </div>
	    </div>
	</div>


	<div class="modal fade bd-example-modal-xl" id="updateParentMenuModal" tabindex="-1" role="dialog" aria-labelledby="updateParentMenuModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="updateParentMenuModalTitle">Update Parent Menu</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <form id="form_update_parent_menu" enctype="multipart/form-data">
	            <div class="modal-body">
	            	
	            		<input type="hidden" name="child_menu_id" id="child_menu_id">
	            		<div class="row">
	                        <div class="col-md-12">
	                            <div class="form-group">
	                                <label>Practice Paper</label>
	                                <select class="form-control" name="parent_menu_id" id="parent_menu_id">
										<option value="0">Select Parent Menu</option>
										<?php
										if(!empty($course_parent_menues)){
											foreach ($course_parent_menues as $key => $value) {
												?>
												<option value="<?php echo $value['menu_id'];?>"><?php echo $value['menu_name'];?></option>
												<?php
											}
										}
										?>
									</select>
	                            </div>
	                        </div>
	                    </div>
	            	
	            </div>
	            <div class="modal-footer">
	               <button type="submit" class="btn btn-primary">Update</button>
	            </div>
	        </form>
            
        </div>
    </div>
</div>


<script type="text/javascript">var course_parent='';var course_id='<?php echo $course_data->course_id;?>';var _parent_stream='';var stream ='';var degree='';var hdr='0';var parent_folder='';var p_row='';</script>