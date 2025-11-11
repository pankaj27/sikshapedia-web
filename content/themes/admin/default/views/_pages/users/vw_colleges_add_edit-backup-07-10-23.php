<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/institutions/colleges">Colleges</a></li>
			<li class="breadcrumb-item active" aria-current="page"><?php echo (!empty($college_id))?'Update':'Add';?> College</li>
		</ol>
	</nav>

	<?php

	if(isset($college_id) && (!empty($college_id))){
		?>
		<div class="profile-page tx-13">
			<div class="row">
	            <div class="col-12 grid-margin">
					<div class="profile-header">
						<div class="cover">
							<div class="gray-shade"></div>
							<figure>
								<img src="<?php echo (!empty($college_data))?$college_data['college_banner']:'';?>" class="img-fluid" alt="profile cover" style="height: 300px;">
							</figure>
							<div class="cover-body d-flex justify-content-between align-items-center">
								<div>
									<img class="profile-pic" src="<?php echo (!empty($college_data))?$college_data['college_logo']:'';?>" alt="profile">
									<a href="<?php echo (!empty($college_data))?$college_data['college_access_url']:'';?>" target="_blank"><span class="profile-name"><?php echo (!empty($college_data))?$college_data['college_name']:'';?></span></a>
								</div>
							</div>
						</div>
						<div class="header-links">
							<ul class="links d-flex align-items-center mt-3 mt-md-0">
								<li class="header-link-item d-flex align-items-center active">
									<button class="btn btn-primary btn-icon-text btn-edit-profile" data-toggle="modal" data-target="#collegeInnerMenuesModal" data-menu_type="college" data-menu_type_id="<?php echo decode_data($college_id);?>" id="btn_create_inner_menu"> Create inner Menues</button>
								</li>
								<!-- <li class="header-link-item ml-3 pl-3 border-left d-flex align-items-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user mr-1 icon-md"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
									<a class="pt-1px d-none d-md-block" href="#">About</a>
								</li>
								<li class="header-link-item ml-3 pl-3 border-left d-flex align-items-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users mr-1 icon-md"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
									<a class="pt-1px d-none d-md-block" href="#">Friends <span class="text-muted tx-12">3,765</span></a>
								</li>
								<li class="header-link-item ml-3 pl-3 border-left d-flex align-items-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image mr-1 icon-md"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
									<a class="pt-1px d-none d-md-block" href="#">Photos</a>
								</li>
								<li class="header-link-item ml-3 pl-3 border-left d-flex align-items-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video mr-1 icon-md"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
									<a class="pt-1px d-none d-md-block" href="#">Videos</a>
								</li> -->
							</ul>
						</div>
	            	</div>
	            </div>
			</div>
		</div>
		<?php

		if(isset($inner_menues_assigned) && !empty($inner_menues_assigned)){
			?>
			<div class="profile-page tx-13">
				<div class="row">
					<div class="col-12 grid-margin">
						<div class="profile-header table-responsive">
							<table class="table">
								<thead>
									<tr>
										<th>Inner Menu</th>
									</tr>
								</thead>
								<tbody>
									<tr>
									<?php
									foreach ($inner_menues_assigned as $key => $value) {
										?>
										<td>
											<div class="btn-group" role="group" aria-label="Basic example">
												<a class="btn btn-primary btn-icon-text btn-edit-profile" href="<?php echo $value['menu_link'];?>"> <?php echo (!empty($value['menu_name']))?$value['menu_name']:$value['menu_type'];?></a>
												<button class="btn btn-xs btn-danger btn_del_college_inner_menu" type="button" data-cid="<?php echo $college_id;?>" data-aid="<?php echo encode_data($value['menu_id']);?>">Remove Menu</button>
											</div>
										</td>
										<?php
									}
									?>
									</tr>
								</tbody>
							</table>						
						</div>
					</div>
				</div>
			</div>
			<?php
		}
	}

	?>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title"><?php echo (!empty($college_id))?'Update':'Add';?> College - [ <?php echo (!empty($college_data))?$college_data['college_name']:'';?> ]  <button type="button" class="btn btn-xs btn-info" data-target="#notesModal" data-toggle="modal">Note</button></h6>
					<form id="form_college">

						<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
						<div class="row">
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Country</label>
									<select class="form-control" name="college_country" id="college_country">
										<?php
										if(!empty($countries)){
											foreach ($countries as $key => $value) {
												?>
												<option value="<?php echo $value['country_id'];?>" <?php echo $value['selected'];?>><?php echo $value['country_name'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">State</label>
									<select class="form-control" name="college_state" id="college_state">
										<option value="0">Select State</option>
										<?php
										if(!empty($states)){
											foreach ($states as $key => $value) {
												?>
												<option value="<?php echo $value['state_id'];?>" <?php echo $value['selected'];?>><?php echo $value['state_name'];?></option>
												<?php
											}
										}
										?>
									</select>
								</div>
							</div>
							
							<div class="col-sm-3" style="display:none;">
								<div class="form-group">
									<label class="control-label">District</label>
									<select class="form-control" name="college_district" id="college_district">
										<option value="0">Select District</option>
										<?php
										if(!empty($districts)){
											foreach ($districts as $key => $value) {
												?>
												<option value="<?php echo $value['district_id'];?>" <?php echo $value['selected'];?>><?php echo $value['district_name'];?></option>
												<?php
											}
										}
										?>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">City</label>
									<select class="form-control" name="college_city" id="college_city">
										<option value="0">Select City</option>
										<?php
										if(!empty($cities)){
											foreach ($cities as $key => $value) {
												?>
												<option value="<?php echo $value['city_id'];?>" <?php echo $value['selected'];?>><?php echo $value['city_name'];?></option>
												<?php
											}
										}
										?>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Institute Type</label>
									<select class="form-control" name="college_utype" id="college_utype">
										<option value="0">Select Type of Institute</option>
										<option value="3" <?php echo (!empty($college_data) && ($college_data['college_utype']=='3'))?'selected':'';?>>University</option>
										<option value="4" <?php echo (!empty($college_data) && ($college_data['college_utype']=='4'))?'selected':'';?>>College</option>
									</select>
								</div>
							</div>							
						</div>
						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">University (optional)</label>
									<select class="form-control" name="college_university" id="college_university">
										<option value="0">Select University</option>
										<?php
										if(!empty($universities)){
											foreach ($universities as $key => $value) {
												?>
												<option value="<?php echo $value['university_id'];?>" <?php echo $value['selected'];?>><?php echo $value['university_name'];?></option>
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
									<label class="control-label">College Name</label>
									<input type="text" class="form-control" placeholder="Enter name" name="college_name" id="college_name" value="<?php echo (!empty($college_data))?$college_data['college_name']:'';?>">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">College Short Name</label>
									<input type="text" class="form-control" placeholder="Enter short name" name="college_short_name" id="college_short_name" value="<?php echo (!empty($college_data))?$college_data['college_short_name']:'';?>">
								</div>
							</div>						
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">College Email</label>
									<input type="text" class="form-control" placeholder="Enter official email" name="college_email" id="college_email" value="<?php echo (!empty($college_data))?$college_data['college_email']:'';?>">
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">College Phone No.</label>
									<input type="text" class="form-control" placeholder="Enter official phone no." name="college_phone" id="college_phone" value="<?php echo (!empty($college_data))?$college_data['college_phone_no']:'';?>">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">College Estd. In</label>
									<input type="text" class="form-control" placeholder="Enter Estd. Year" name="college_estd" id="college_estd" value="<?php echo (!empty($college_data))?$college_data['college_estd_year']:'';?>">
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">College Type</label>
									<select class="form-control" name="college_type" id="college_type">
										<option value="0">Select College Type</option>
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
							</div>
							
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="college_status">
										<option value="1" <?php echo (!empty($college_data) && ($college_data['college_status']=='1'))?'selected':'';?>>Active</option>
										<option value="2" <?php echo (!empty($college_data) && ($college_data['college_status']=='2'))?'selected':'';?>>Deactive</option>
									</select>
								</div>
							</div>
						</div>
						
						<div class="row">							
							<div class="col-sm-8">
								<div class="form-group">
									<label class="control-label">Address</label>
									<textarea class="form-control" rows="2" placeholder="College Address" name="college_address"><?php echo (!empty($college_data))?$college_data['college_address']:'';?></textarea>
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Pincode</label>
									<input type="text" class="form-control" placeholder="College pincode" name="college_pincode" value="<?php echo (!empty($college_data))?$college_data['college_pincode']:'';?>">
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-6">
								<div class="form-group">
									<label>College Logo</label>
									<input type="file" name="college_logo" class="file-upload-default">
									<div class="input-group col-xs-12">
										<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="<?php echo (!empty($college_data))?$college_data['college_logo_name']:'';?>">
										<span class="input-group-append">
											<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
										</span>
									</div>
								</div>
							</div>
							<div class="col-sm-6">
								<div class="form-group">
									<label>College Banner</label>
									<input type="file" name="college_banner" class="file-upload-default">
									<div class="input-group col-xs-12">
										<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Banner" value="<?php echo (!empty($college_data))?$college_data['college_banner_name']:'';?>">
										<span class="input-group-append">
											<button class="file-upload-browse btn btn-primary" type="button">Browse Banner</button>
										</span>
									</div>
								</div>
							</div>
						</div>

						<div class="row">
							<?php
							if($userdata->user_quota_applicable!='1'){
								?>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Admin Verified</label>
										<select class="form-control" name="college_verified">
											<option value="1" <?php echo (!empty($college_data) && ($college_data['college_is_verified']=='1'))?'selected':'';?>>Verified</option>
											<option value="2" <?php echo (!empty($college_data) && ($college_data['college_is_verified']=='2'))?'selected':'';?>>Not Verified</option>
										</select>
									</div>
								</div>
								<?php
							}
							?>

							<?php
							if($userdata->user_role=='1'){
								?>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Is Top</label>
										<select class="form-control" name="college_is_top">
											<option value="1" <?php echo (!empty($college_data) && ($college_data['college_is_top']=='1'))?'selected':'';?>>Yes</option>
											<option value="2" <?php echo (!empty($college_data) && ($college_data['college_is_top']=='2'))?'selected':'';?>>No</option>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Is Top Ranked</label>
										<select class="form-control" name="college_is_top_ranked">
											<option value="1" <?php echo (!empty($college_data) && ($college_data['college_is_top_ranked']=='1'))?'selected':'';?>>yes</option>
											<option value="2" <?php echo (!empty($college_data) && ($college_data['college_is_top_ranked']=='2'))?'selected':'';?>>No</option>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Is Featured College</label>
										<select class="form-control" name="college_is_featured">											
											<option value="2" <?php echo (!empty($college_data) && ($college_data['college_is_featured']=='2'))?'selected':'';?>>No</option>
											<option value="1" <?php echo (!empty($college_data) && ($college_data['college_is_featured']=='1'))?'selected':'';?>>Yes</option>
										</select>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Visible in Home Page</label>
										<select class="form-control" name="college_is_visible_in_home_page">
											<option value="1" <?php echo (!empty($college_data) && ($college_data['college_show_in_home_page']=='1'))?'selected':'';?>>Yes</option>
											<option value="2" <?php echo (!empty($college_data) && ($college_data['college_show_in_home_page']=='2'))?'selected':'';?>>No</option>
										</select>
									</div>
								</div>
								<?php
							}
							?>
								
								
						</div>

						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">Intro Video(Youtube video link.If the video is available add link or leave it blank.)</label>
									<input type="text" class="form-control" placeholder="Intro Video" name="college_youtube_video_link" value="<?php echo (!empty($college_data))?$college_data['college_intro_video']:'';?>">
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">College Grades</label>
									<select class="form-control" name="college_grades">
										<option value="0">Select Grade if any</option>
										<?php
										if(!empty($institute_grades)){
											foreach ($institute_grades as $key => $value) {
												?>
												<option value="<?php echo $value['grade_id'];?>" <?php echo $value['selected'];?>><?php echo $value['grade_name'];?></option>
												<?php
											}
										}
										?>
									</select>
								</div>
							</div>
							<div class="col-sm-9">
								<div class="form-group">
									<label class="control-label">NAAC Grading System</label>
									<div class="alert alert-info" >
										<h6>Higher learning institutes in India are graded for each key aspect/ parameter under four different categories such as 'A', 'B', 'C', and 'D'. The NAAC grade denotes the performance of institutes such as very good, good, satisfactory, and unsatisfactory.</h6>
									</div>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label><strong>Info (default menu) Page Heading</strong></label>
									<textarea class="form-control" name="college_info_menu_page_heading" rows="5">
										<?php echo (!empty($college_data))?$college_data['college_info_page_heading']:'';?>
									</textarea>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label><strong>Other Colleges In The Same Group</strong></label>
									<select class="form-control" multiple="true" name="colleges_same_group_colleges[]" id="colleges_same_group_colleges">
									</select>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-12">
								<label><strong>College Ranking Description</strong></label>
								<textarea class="form-control college_ranking_info" rows="10" name="college_ranking_info">
									<?php
									if(!empty($college_data['college_ranking_info'])){
										echo $college_data['college_ranking_info'];
									}
									?>
								</textarea>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-12">
        						<table class="table" id="form_college_ranking_table">
		        					<thead>
		        						<tr>
		        							<th>Ranking Body</th>
		        							<th>Ranking Years</th>
		        							<th>Ranking Category</th>
		        							<th>Ranking Value</th>
		        							<th>Ranking Out of</th>
		        							<th>
		        								<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_ranking_row"><i class="fa fa-plus"></i></button>
		        							</th>
		        						</tr>
		        					</thead>
		        					<tbody>
		        						<?php
		        						$cri=0;
		        						if(!empty($college_ranking_data)){

		        							//print_obj($college_ranking_data);

		        							foreach ($college_ranking_data as $k => $v) {
		        								?>
			        							<tr id="tr<?php echo $cri;?>">
				        							<td>
				        								<select class="form-control" name="college_ranking[<?php echo $cri;?>][body]">
															<?php
															foreach ($institute_ranking_bodies as $key => $value) {
																?>
																<option value="<?php echo $value['rank_body_id'];?>" <?php echo ($value['id']==$v->ranking_body_id)?'selected':'';?>><?php echo $value['rank_body'];?></option>
																<?php
															}
															?>
														</select>
				        							</td>
				        							<td>
														<input type="text" name="college_ranking[<?php echo $cri;?>][years]" value="<?php echo $v->ranking_year;?>" placeholder="Enter rank year" class="form-control">
				        							</td>
				        							<td>
				        								<select class="form-control" name="college_ranking[<?php echo $cri;?>][category]">
															<?php
															foreach ($institute_ranking_categories as $key => $value) {
																?>
																<option value="<?php echo $value['rank_category_id'];?>" <?php echo ($value['id']==$v->ranking_category_id)?'selected':'';?>>
																		<?php echo $value['rank_category'];?></option>
																<?php
															}
															?>
														</select>
				        							</td>
				        						

				        							<td>
				        								<input class="form-control" name="college_ranking[<?php echo $cri;?>][value]" value="<?php echo $v->ranking_value;?>">
				        							</td>
				        							<td>
				        								<select class="form-control" name="college_ranking[<?php echo $cri;?>][category_value]">
															<?php
															for ($i = 100; $i <=700; $i++) {
																?>
													        	<option value="<?php echo $i;?>" <?php echo ($v->ranking_value_outof==$i)?'selected':'';?>><?php echo $i;?></option>
													        	<?php
													      	}
															?>
														</select>
				        							</td>
				        							<td><button type="button" class="btn btn-xs btn-danger" onclick="$('#tr<?php echo $cri;?>').remove()"><i class="fa fa-minus"></i></button></td>
				        						</tr>
			        							<?php

		        								$cri++;
		        							}
		        						}else{
		        							?>
		        							<tr id="tr<?php echo $cri;?>">
		        								<td colspan="5" align="center">No Ranking Data Added Yet</td>
			        						</tr>
		        							<?php
		        						}
		        						?>			        								        					
		        					</tbody>
		        					<tfoot>
		        						<tr>
		        							<th>Ranking Body</th>
		        							<th>Ranking Years</th>
		        							<th>Ranking Category</th>
		        							<th>Ranking Value</th>
		        							<th>Ranking Out of</th>
		        							<th>
		        								<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_ranking_row"><i class="fa fa-plus"></i></button>
		        							</th>
		        						</tr>
		        					</tfoot>
		        				</table>
		        			</div>
		        		</div>
						

						<div class="row">
							<div class="col-sm-12">

								<div class="form-group" id="college_affiliations_div">
									<?php
										if(!empty($institute_affiliations)){
											?>
											
											<label class="control-label"><strong>College Affiliation</strong></label><br>
											<?php
											foreach ($institute_affiliations as $key => $value) {
												?>
												<div class="form-check form-check-inline">
													<label class="form-check-label">
														<input type="checkbox" class="form-check-input" value="<?php echo $value['statutory_body_id'];?>" name="college_affiliations[]" <?php echo $value['selected'];?>>
														<?php echo $value['statutory_body_abbr'];?>
													<i class="input-frame"></i></label>
												</div>
												<?php
											}
										}
									?>

								</div>
							</div>
						</div>


						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label"><strong>Facilities Available</strong></label><br>
									<?php
									if(!empty($institue_facilities)){
										foreach ($institue_facilities as $key => $value) {
											?>
											<div class="form-check form-check-inline">
												<label class="form-check-label">
													<input type="checkbox" class="form-check-input" value="<?php echo $value['facility_id'];?>" name="college_faciliies[]" <?php echo $value['selected'];?>>
													<?php echo $value['facility_name'];?>
												<i class="input-frame"></i></label>
											</div>
											<?php
										}
									}
									?>
								</div>
							</div>
						</div>


						<h6>Facilities Introduction</h6>
						<hr>
						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<input type="hidden" name="college_info_type" value="1">
									<textarea class="form-control college_info" name="college_facilities_info" id="college_facilities_info" rows="10" >
										<?php
										if(!empty($college_data['college_facilities_info'])){
											echo $college_data['college_facilities_info'];
										}
										?>
									</textarea>
								</div>
							</div>
						</div>

						<h6>College Introduction (Short Description)</h6>
						<hr>
						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<input type="hidden" name="college_info_type" value="1">
									<textarea class="form-control college_info" name="college_general_info" id="college_general_info" rows="10" >
										<?php
										if(!empty($college_data['college_general_info'])){
											echo $college_data['college_general_info'];
										}
										?>
									</textarea>
								</div>
							</div>
						</div>

						<h6>College Introduction (Broad Description)</h6>
						<hr>

						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<input type="hidden" name="college_info_type" value="2">
									<textarea class="form-control college_info" name="college_about_info" id="college_about_info" rows="10" >
										<?php
										if(!empty($college_data['college_about_info'])){
											echo $college_data['college_about_info'];
										}
										?>
									</textarea>
								</div>
							</div>
						</div>


						<h6>College FAQs</h6>
						<hr>

						<div class="row">
        					<div class="col-sm-12">
        						<table class="table" id="form_college_faqus_table">
		        					<thead>
		        						<tr>
		        							<th>Question/Answer</th>
		        							<th></th>
		        						</tr>
		        					</thead>
		        					<tbody>
		        						<?php
		        						if(!empty($college_data['college_faqs'])){
		        							$i=0;
		        							foreach ($college_data['college_faqs'] as $key => $value) {
		        								?>
		        								<tr id="tr<?php echo $i;?>">
				        							<td>
					        							<input type="text" class="form-control" name="college_faqus[<?php echo $i;?>][ques]" aria-describedby="college_faqus" placeholder="Question" value="<?php echo $key;?>">
					        						
					        							<textarea class="form-control college_info" name="college_faqus[<?php echo $i;?>][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"><?php echo $value;?></textarea>
					        						</td>

					        						<?php 
					        						if($i==0){
					        							?>
					        							<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_college_faqus_row"><i class="fa fa-plus"></i></button></td>
					        							<?php
					        						}else{
					        							?>
					        							<td>
					        								<div class="btn-group">
					        									<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_faqus_row"><i class="fa fa-plus"></i></button>
					        									<button type="button" class="btn btn-xs btn-danger" onclick="$('#tr<?php echo $i;?>').remove()"><i class="fa fa-minus"></i></button>
					        								</div>

					        							</td>
					        							<?php
					        						}
					        						?>
					        					</tr>
		        								<?php
		        								$i++;
		        							}
		        						}else{
		        							?>		        							
		        							<tr>
			        							<td>
				        							<input type="text" class="form-control" name="college_faqus[0][ques]" aria-describedby="college_faqus" placeholder="Question" value="">
				        						
				        							<textarea class="form-control college_info" name="college_faqus[0][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"></textarea>
				        						</td>

				        						<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_college_faqus_row"><i class="fa fa-plus"></i></button></td>
				        					</tr>
		        							<?php
		        						}
		        						?>
			        									
		        					</tbody>
		        				</table>

        					</div>
        				</div>

        				<h6>Placement Short Description & FAQs</h6>
						<hr>

						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<input type="hidden" name="college_info_type" value="2">
									<textarea class="form-control college_info" name="college_placement_info" id="college_placement_info" rows="10" >
										<?php
										if(!empty($college_data['college_placement_info'])){
											echo $college_data['college_placement_info'];
										}
										?>
									</textarea>
								</div>
							</div>
						</div>

						<div class="row">
        					<div class="col-sm-12">
        						<table class="table" id="form_college_placement_faqus_table">
		        					<thead>
		        						<tr>
		        							<th>Question/Answer</th>
		        							<th></th>
		        						</tr>
		        					</thead>
		        					<tbody>
		        						<?php
		        						if(!empty($college_data['college_placement_faqs'])){
		        							$j=0;
		        							foreach ($college_data['college_placement_faqs'] as $key => $value) {
		        								?>
		        								<tr id="tr2<?php echo $j;?>">
				        							<td>
					        							<input type="text" class="form-control" name="college_placement_faqs[<?php echo $j;?>][ques]" aria-describedby="college_placement_faqs" placeholder="Question" value="<?php echo $key;?>">
					        						
					        							<textarea class="form-control college_info" name="college_placement_faqs[<?php echo $j;?>][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"><?php echo $value;?></textarea>
					        						</td>

					        						<?php 
					        						if($j==0){
					        							?>
					        							<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_college_placement_faqus_row"><i class="fa fa-plus"></i></button></td>
					        							<?php
					        						}else{
					        							?>
					        							<td><button type="button" class="btn btn-xs btn-danger" onclick="$('#tr2<?php echo $j;?>').remove()"><i class="fa fa-minus"></i></button></td>
					        							<?php
					        						}
					        						?>
					        					</tr>
		        								<?php
		        								$j++;
		        							}
		        						}else{
		        							?>		        							
		        							<tr>
			        							<td>
				        							<input type="text" class="form-control" name="college_placement_faqs[0][ques]" aria-describedby="college_faqus" placeholder="Question" value="">
				        						
				        							<textarea class="form-control college_info" name="college_placement_faqs[0][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"></textarea>
				        						</td>

				        						<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_college_placement_faqus_row"><i class="fa fa-plus"></i></button></td>
				        					</tr>
		        							<?php
		        						}
		        						?>
			        									
		        					</tbody>
		        				</table>

        					</div>
        				</div>


        				<h6>Scholarship FAQs</h6>
						<hr>

						<div class="row">
        					<div class="col-sm-12">
        						<table class="table" id="form_college_scholarship_faqus_table">
		        					<thead>
		        						<tr>
		        							<th>Question/Answer</th>
		        							<th></th>
		        						</tr>
		        					</thead>
		        					<tbody>
		        						<?php
		        						if(!empty($college_data['college_scholarship_faqs'])){
		        							$t=0;
		        							foreach ($college_data['college_scholarship_faqs'] as $key => $value) {
		        								?>
		        								<tr id="tr3<?php echo $t;?>">
				        							<td>
					        							<input type="text" class="form-control" name="college_scholarship_faqs[<?php echo $t;?>][ques]" aria-describedby="college_placement_faqs" placeholder="Question" value="<?php echo $key;?>">
					        						
					        							<textarea class="form-control college_info" name="college_scholarship_faqs[<?php echo $t;?>][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"><?php echo $value;?></textarea>
					        						</td>

					        						<?php 
					        						if($t==0){
					        							?>
					        							<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_college_scholarship_faqus_row"><i class="fa fa-plus"></i></button></td>
					        							<?php
					        						}else{
					        							?>
					        							<td>
					        								<div class="btn-group">
						        								<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_scholarship_faqus_row"><i class="fa fa-plus"></i></button>
						        								<button type="button" class="btn btn-xs btn-danger" onclick="$('#tr3<?php echo $t;?>').remove()"><i class="fa fa-minus"></i></button>
						        							</div>

					        							</td>
					        							<?php
					        						}
					        						?>
					        					</tr>
		        								<?php
		        								$t++;
		        							}
		        						}else{
		        							?>		        							
		        							<tr>
			        							<td>
				        							<input type="text" class="form-control" name="college_scholarship_faqs[0][ques]" aria-describedby="college_faqus" placeholder="Question" value="">
				        						
				        							<textarea class="form-control college_info" name="college_scholarship_faqs[0][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"></textarea>
				        						</td>

				        						<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_college_scholarship_faqus_row"><i class="fa fa-plus"></i></button></td>
				        					</tr>
		        							<?php
		        						}
		        						?>
			        									
		        					</tbody>
		        				</table>

        					</div>
        				</div>

        				<?php

        				if($userdata->user_role=='5'){

        					if(isset($college_id) && decode_data($college_id)!='226'){
        						?>
	        					<div class="row buy-now-wrapper">
									<div class="col-sm-3">
										<button class="btn btn-success btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_college">Save</button>
									</div>
								</div>
	        					<?php
        					}else{
        						?>
        					<div class="row buy-now-wrapper">
								<div class="col-sm-3">
									<button class="btn btn-success btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_college">Save</button>
								</div>
							</div>
        					<?php
        					}

        				}else{
        					?>
        					<div class="row buy-now-wrapper">
								<div class="col-sm-3">
									<button class="btn btn-success btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_college">Save</button>
								</div>
							</div>
        					<?php
        				}

        				?>

						
					</form>
				</div>
			</div>
		</div>
	</div>

</div>


<div class="modal fade bd-example-modal-xl" id="notesModal" tabindex="-1" role="dialog" aria-labelledby="notesModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="notesModalTitle">Terms & Guidelines</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body alert alert-info">
            	<div class="row">
	    			<div class="col-md-12">
	    				<div class="mb-7" id="quality-guidelines" wfd-id="54">
	    					<h6 class="text-primary">Required data to be filled up</h6>
	    					<ol class="text-h6 pb-1" type="1">
	    						<li class="mb-2"><b>College Name</b>-Name Should not contain anyspace before and after and any special charachter(*,+,/,@,#,$,%,^,& etc) and numeric values</li>
	    						<li class="mb-2"><b>College Email</b> - Valid email.</li>
	    						<li class="mb-2"><b>College Pho No.</b> - Valid phone no.(not like these 1111111111111/22222222222/00000000 and so on)</li>
	    						<li class="mb-2"><b>College Estd. Year</b></li>
	    						<li class="mb-2"><b>College Logo & Banner</b> - you can have that from google</li>
	    						<li class="mb-2"><b>College Address & Pincode</b></li>
	    						<li class="mb-2"><b>College Type</b> - Select from the list.</li>
	    						<li class="mb-2"><b>College Country</b> - Select from the list.</li>
	    						<li class="mb-2"><b>College State</b> - Select from the list.</li>
	    						<li class="mb-2"><b>College District</b> - Select from the list if available.</li>
	    						<li class="mb-2"><b>College City</b> - Select from the list.</li>
	    						<li class="mb-2"><b>College University</b> - Select from the list.</li>
	    						<li class="mb-2"><b>College Intro Video</b> - Youtube link(If available).</li>
	    						<li class="mb-2"><b>College Country</b> - Select from the list.</li>
	    						<li class="mb-2"><b>College Affiliations</b> - Select from the list.</li>
	    						<li class="mb-2"><b>College Faciloities</b> - Select from the list(If available).</li>
	    						<li class="mb-2"><b>College Facilities Intro</b> - If Available.</li>
	    						<li class="mb-2"><b>College Short Description</b> - You can have from the google or collegedunia.com.</li>
	    						<li class="mb-2"><b>College Broad Description</b> - You can have from the google or collegedunia.com.</li>
	    						<li class="mb-2"><b>College Faqs</b> - You can have from the google or collegedunia.com.</li>
	    						<li class="mb-2"><b>College Placement Description & Faqs</b> - You can have from the google or collegedunia.com.</li>
	    						<li class="mb-2"><b>College Scholarship Faqs</b> - You can have from the google or collegedunia.com.</li>
	    						<li class="mb-2"><b>College Hostel Info</b> - You can have from the google or collegedunia.com.</li>

	    						<li class="mb-2"><b>College Courses Info</b> - You can have from the collegedunia.com.</li>
	    						<li class="mb-2"><b>College Cutoffs Info</b> - You can have from the google or collegedunia.com.</li>
	    						<li class="mb-2"><b>College Admission Info</b> - You can have from the collegedunia.com.</li>
	    						<li class="mb-2"><b>College Placement detailed Info</b> - You can have from the collegedunia.com. (If not available leave that blank)</li>
	    						<li class="mb-2"><b>College Placement Companies Info</b> - You can have from the collegedunia.com. and companies list available in WaytoAdmissions</li>
	    						<li class="mb-2"><b>College Scholarship Detailed Info</b> - You can have from the collegedunia.com. (If not available leave that blank)</li>
	    						<li class="mb-2"><b>College College Gallery & Videos</b> - You can have from the collegedunia.com. (If not available leave that blank)</li>

	    					</ol>
	    				</div>
	    			</div>
	    		</div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">let _college='<?php echo (isset($college_id) && !empty($college_id))?$college_id:'';?>'; let _ur='<?php echo $userdata->user_role;?>';</script>
<?php
if(!empty($college_data['college_faqs'])){
	?>
	<script type="text/javascript"> var colleg_faq_row=<?php echo count($college_data['college_faqs']);?>;
	 var colleg_placement_faq_row=<?php echo count($college_data['college_placement_faqs']);?>;var colleg_scholarship_faq_row=<?php echo count($college_data['college_scholarship_faqs']);?>;</script>
	<?php
}else{
	?>
	<script type="text/javascript"> var colleg_faq_row=1;var colleg_placement_faq_row=1;var colleg_scholarship_faq_row=1;</script>
	<?php
}

if(!empty($cranking_values)){
	?>
	<script type="text/javascript"> var colleg_ranking_row=<?php echo $cri;?>;</script>
	<?php
}else{
	?>
	<script type="text/javascript"> var colleg_ranking_row=1;</script>
	<?php	
}
?>

<?php
if(!empty($institute_ranking_bodies)){
?>
<script type="text/javascript">
	<?php
	foreach ($institute_ranking_bodies as $key => $value) {
		?>

		var <?php echo $value['rank_body_id'];?>=<?php echo $value['rank_value'];?>;

		<?php
	}
	?>
</script>
<?php
}
?>

<script type="text/javascript">
	var institute_ranking_bodies=<?php echo json_encode($institute_ranking_bodies);?>;var institute_ranking_categories=<?php echo json_encode($institute_ranking_categories);?>;var institue_ranking_years=<?php echo json_encode($institue_ranking_years);?>;var p_row='';var college_type='10';var college_id='<?php echo (!empty($college_data))?$college_data['college_id']:'';?>';
var loadergif='<?php echo base_url('uploads/app/default/carina_loader_animation.gif');?>';
</script>
