<!-- <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">-->
<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/institutions/universities">Universities</a></li>
			<li class="breadcrumb-item active" aria-current="page">Add University</li>
		</ol>
	</nav>

	<?php

	if(isset($university_id) && (!empty($university_id))){
		?>
		<div class="profile-page tx-13">
			<div class="row">
	            <div class="col-12 grid-margin">
					<div class="profile-header">
						<div class="cover">
							<div class="gray-shade"></div>
							<figure>
								<img src="<?php echo (!empty($university_data))?$university_data['college_banner']:'';?>" class="img-fluid" alt="profile cover" style="height: 300px;">
							</figure>
							<div class="cover-body d-flex justify-content-between align-items-center">
								<div>
									<img class="profile-pic" src="<?php echo (!empty($university_data))?$university_data['college_logo']:'';?>" alt="profile">
									<a href="<?php echo (!empty($university_data))?$university_data['college_access_url']:'';?>" target="_blank"><span class="profile-name"><?php echo (!empty($university_data))?$university_data['college_name']:'';?></span></a>
								</div>
							</div>
						</div>
						<div class="header-links">
							<ul class="links d-flex align-items-center mt-3 mt-md-0">
								<li class="header-link-item d-flex align-items-center active">
									<button class="btn btn-primary btn-icon-text btn-edit-profile" data-toggle="modal" data-target="#collegeInnerMenuesModal" data-menu_type="university" data-menu_type_id="<?php echo decode_data($university_id);?>" id="btn_create_inner_menu"> Create inner Menues</button>
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
					<h6 class="card-title"><?php echo ($university_id!=null)?'Update':'Add';?> University - [ <?php echo (!empty($university_data))?$university_data['college_name']:'';?>]</h6>
					<form id="form_university">
						<input type="hidden" class="form-control" name="_university" id="_university" value="<?php echo $university_id;?>">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">

						<div class="row">
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Country</label>
									<select class="form-control" name="university_country" id="university_country">
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
									<select class="form-control" name="university_state" id="university_state">
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
							<!-- <div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">District</label>
									<select class="form-control" name="university_district" id="university_district">
										<option value="0">Select District</option>
										<?php
										// if(!empty($districts)){
										// 	foreach ($districts as $key => $value) {
										// 		?>
										// 		<option value="<?php echo $value['district_id'];?>" <?php echo $value['selected'];?>><?php echo $value['district_name'];?></option>
										// 		<?php
										// 	}
										// }
										?>
									</select>
								</div>
							</div> -->
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">City</label>
									<select class="form-control" name="university_city" id="university_city">
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
									<label class="control-label">University Category</label>
									<select class="form-control" name="university_category" id="university_category">
										<option value="0">None</option>
										<?php
										if(!empty($inst_categories)){
											foreach ($inst_categories as $key => $value) {
												?>
												<option value="<?php echo $value['category_id'];?>" <?php echo $value['selected'];?>><?php echo $value['category_name'];?></option>
												<?php
											}
										}
										?>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">University Estd. In</label>
									<input type="text" class="form-control" placeholder="Enter Estd. Year" name="university_estd" id="university_estd" value="<?php echo (!empty($university_data))?$university_data['college_estd_year']:'';?>">
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">University Type</label>
									<select class="form-control" name="university_type" id="university_type">
										<option value="0">Select University Type</option>
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
									<label class="control-label">University Email</label>
									<input type="text" class="form-control" placeholder="Enter Email Id" name="university_email" id="university_email" value="<?php echo (!empty($university_data))?$university_data['college_email']:'';?>">
								</div>
							</div>
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">University Phone No</label>
									<input type="text" class="form-control" placeholder="Enter Phone No" name="university_phone" id="university_phone" value="<?php echo (!empty($university_data))?$university_data['college_phone_no']:'';?>">
								</div>
							</div>
							<div class="col-sm-2">
								<div class="form-group">
									<label class="control-label">Status</label>
									<select class="form-control" name="university_status">
										<option value="1" <?php echo (!empty($university_data) && ($university_data['college_status']=='1'))?'selected':'';?>>Active</option>
										<option value="2" <?php echo (!empty($university_data) && ($university_data['college_status']=='2'))?'selected':'';?>>Deactive</option>
									</select>
								</div>
							</div>							
						</div>
						<div class="row">
							<div class="col-sm-9">
								<div class="form-group">
									<label class="control-label">University Name</label>
									<input type="text" class="form-control" placeholder="University Name" name="university_name" id="university_name" value="<?php echo (!empty($university_data))?$university_data['college_name']:'';?>">
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">University Short Name</label>
									<input type="text" class="form-control" placeholder="University Short Name" name="university_short_name" id="university_short_name" value="<?php echo (!empty($university_data))?$university_data['college_short_name']:'';?>">
								</div>
							</div>
						</div>
						<div class="row">							
							<div class="col-sm-8">
								<div class="form-group">
									<label class="control-label">Address</label>
									<textarea class="form-control" rows="2" placeholder="University Address" name="university_address"><?php echo (!empty($university_data))?$university_data['college_address']:'';?></textarea>
								</div>
							</div>
							<div class="col-sm-4">
								<div class="form-group">
									<label class="control-label">Pincode</label>
									<input type="text" class="form-control" placeholder="University pincode" name="university_pincode" value="<?php echo (!empty($university_data))?$university_data['college_pincode']:'';?>">
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-sm-6">
								<div class="form-group">
									<label>University Logo</label>
									<input type="file" name="university_logo" id="university_logo" class="file-upload-default">
									<div class="input-group col-xs-12">
										<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Logo" value="<?php echo $user_logo_name;?>">
										<span class="input-group-append">
											<button class="file-upload-browse btn btn-primary" type="button">Browse Logo</button>
										</span>
									</div>
								</div>
								<div class="form-group">
									<div class="col-xs-12">
										<img src="" class="">
									</div>
								</div>
							</div>
							<div class="col-sm-6">
								<div class="form-group">
									<label>University Banner</label>
									<input type="file" name="university_banner" class="file-upload-default">
									<div class="input-group col-xs-12">
										<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Banner" value="<?php echo $user_banner_name;?>">
										<span class="input-group-append">
											<button class="file-upload-browse btn btn-primary" type="button">Browse Banner</button>
										</span>
									</div>
								</div>
								<div class="form-group">
									<div class="col-xs-12">
										<img src="" class="">
									</div>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Admin Verified</label>
									<select class="form-control" name="university_verified">
										<option value="1" <?php echo (!empty($university_data) && ($university_data['college_is_verified']=='1'))?'selected':'';?>>Verified</option>
										<option value="2" <?php echo (!empty($university_data) && ($university_data['college_is_verified']=='2'))?'selected':'';?>>Not Verified</option>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Is Top</label>
									<select class="form-control" name="university_is_top">
										<option value="1" <?php echo (!empty($university_data) && ($university_data['college_is_top']=='1'))?'selected':'';?>>Yes</option>
										<option value="2" <?php echo (!empty($university_data) && ($university_data['college_is_top']=='2'))?'selected':'';?>>No</option>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Is Top Ranked</label>
									<select class="form-control" name="university_is_top_ranked">
										<option value="1" <?php echo (!empty($university_data) && ($university_data['college_is_top_ranked']=='1'))?'selected':'';?>>yes</option>
										<option value="2" <?php echo (!empty($university_data) && ($university_data['college_is_top_ranked']=='2'))?'selected':'';?>>No</option>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Is Featured University</label>
									<select class="form-control" name="university_is_featured">											
										<option value="2" <?php echo (!empty($university_data) && ($university_data['college_is_featured']=='2'))?'selected':'';?>>No</option>
										<option value="1" <?php echo (!empty($university_data) && ($university_data['college_is_featured']=='1'))?'selected':'';?>>Yes</option>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Is Featured University visible in Menu</label>
									<select class="form-control" name="university_is_featured_visible_in_menu">											
										<option value="2" <?php echo (!empty($university_data) && ($university_data['college_is_featured_visible_in_menu']=='2'))?'selected':'';?>>No</option>
										<option value="1" <?php echo (!empty($university_data) && ($university_data['college_is_featured_visible_in_menu']=='1'))?'selected':'';?>>Yes</option>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">Visible in Home Page</label>
									<select class="form-control" name="university_is_visible_in_home_page">
										<option value="1" <?php echo (!empty($university_data) && ($university_data['college_show_in_home_page']=='1'))?'selected':'';?>>Yes</option>
										<option value="2" <?php echo (!empty($university_data) && ($university_data['college_show_in_home_page']=='2'))?'selected':'';?>>No</option>
									</select>
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">University Website</label>
									<input type="text" class="form-control" placeholder="Website" name="university_webaddress" value="<?php echo (!empty($university_data))?$university_data['college_web_address']:'';?>">
								</div>
							</div>
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">University Genere</label>
									<select class="form-control" name="university_genere">
										<?php
										foreach ($college_genere as $key => $value) {
											?>
											<option value="<?php echo $value['college_genere_value'];?>" <?php echo $value['selected'];?>><?php echo $value['college_genere_name'];?></option>
											<?php
										}
										?>
									</select>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label class="control-label">Intro Video(Youtube video link.If the video is available add link or leave it blank.)</label>
									<input type="text" class="form-control" placeholder="Intro Video" name="university_youtube_video_link" value="<?php echo (!empty($university_data))?$university_data['college_intro_video']:'';?>">
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-3">
								<div class="form-group">
									<label class="control-label">University Grades</label>
									<select class="form-control" name="university_grades">
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
							<div class="col-sm-6">
								<div class="form-group">
									<label>Info (default menu) Page Heading</label>
									<textarea class="form-control" name="university_info_menu_page_heading" rows="3">
										<?php echo (!empty($university_data))?$university_data['college_info_page_heading']:'';?>
									</textarea>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<label><strong>Other Colleges In The Same Group</strong></label>
									<select class="form-control" multiple="true" name="university_same_group_colleges[]" id="university_same_group_colleges">
									</select>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-12">
								<label><strong>University Ranking Description</strong></label>
								<textarea class="form-control university_info" rows="10" name="university_ranking_info" style="width: 100%;">
									<?php
									if(!empty($university_data['college_ranking_info'])){
										echo $university_data['college_ranking_info'];
									}
									?>
								</textarea>
							</div>
						</div>

						<div class="row">
							<div class="col-sm-12 table-responsive">
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
		        						if(!empty($university_ranking_data)){

		        							//print_obj($college_ranking_data);

		        							foreach ($university_ranking_data as $k => $v) {
		        								?>
			        							<tr id="tr<?php echo $cri;?>">
				        							<td>
				        								<select class="form-control" name="university_ranking[<?php echo $cri;?>][body]">
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
				        								<select class="form-control" name="university_ranking[<?php echo $cri;?>][years]">
															<?php
															foreach ($institue_ranking_years as $key => $value) {
																?>
																<option value="<?php echo $value['ranking_year'];?>" <?php echo ($vlaue['ranking_year']===$v->ranking_year)?'selected':'';?>><?php echo $value['ranking_year'];?></option>
																<?php
															}
															?>
														</select>
				        							</td>
				        							<td>
				        								<select class="form-control" name="university_ranking[<?php echo $cri;?>][category]">
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
				        								<input class="form-control" name="university_ranking[<?php echo $cri;?>][value]" value="<?php echo $v->ranking_value;?>">
				        							</td>
				        							<td>
				        								<select class="form-control" name="university_ranking[<?php echo $cri;?>][category_value]">
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

								<div class="form-group" id="un iversity_affiliations_div">
									<?php
										if(!empty($institute_affiliations)){
											?>
											
											<label class="control-label"><strong>University Affiliation</strong></label><br>
											<?php
											foreach ($institute_affiliations as $key => $value) {
												?>
												<div class="form-check form-check-inline">
													<label class="form-check-label">
														<input type="checkbox" class="form-check-input" value="<?php echo $value['statutory_body_id'];?>" name="university_affiliations[]" <?php echo $value['selected'];?>>
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
													<input type="checkbox" class="form-check-input" value="<?php echo $value['facility_id'];?>" name="university_faciliies[]" <?php echo $value['selected'];?>>
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
									<input type="hidden" name="university_info_type" value="1">
									<textarea class="form-control university_info" name="university_facilities_info" id="university_facilities_info" rows="10" >
										<?php
										if(!empty($university_data['college_facilities_info'])){
											echo $university_data['college_facilities_info'];
										}
										?>
									</textarea>
								</div>
							</div>
						</div>


						<h6>University Introduction (Short Description)</h6>
						<hr>
						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<input type="hidden" name="university_info_type" value="1">
									<textarea class="form-control university_info" name="university_general_info" id="university_general_info" rows="10" >
										<?php
										if(!empty($university_data['college_general_info'])){
											echo $university_data['college_general_info'];
										}
										?>
									</textarea>
								</div>
							</div>
						</div>


						<h6>University Introduction (Broad Description)</h6>
						<hr>

						<div class="row">
							<div class="col-sm-12">
								<div class="form-group">
									<input type="hidden" name="university_info_type" value="2">
									<textarea class="form-control university_info" name="university_about_info" id="university_about_info" rows="100" >
										<?php
										if(!empty($university_data['college_about_info'])){
											echo $university_data['college_about_info'];
										}
										?>
									</textarea>
								</div>
							</div>
						</div>


						<h6>University FAQs</h6>
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
		        						if(!empty($university_data['college_faqs'])){
		        							$i=0;
		        							foreach ($university_data['college_faqs'] as $key => $value) {
		        								?>
		        								<tr id="tr<?php echo $i;?>">
				        							<td>
					        							<input type="text" class="form-control" name="university_faqus[<?php echo $i;?>][ques]" aria-describedby="university_faqus" placeholder="Question" value="<?php echo $key;?>">

					        							<textarea class="form-control university_info" name="university_faqus[<?php echo $i;?>][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"><?php echo $value;?></textarea>
					        						</td>

					        						<?php 
					        						if($i==0){
					        							?>
					        							<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_college_faqus_row"><i class="fa fa-plus"></i></button></td>
					        							<?php
					        						}else{
					        							?>
					        							<td><button type="button" class="btn btn-xs btn-danger" onclick="$('#tr<?php echo $i;?>').remove()"><i class="fa fa-minus"></i></button></td>
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
				        							<input type="text" class="form-control" name="university_faqus[0][ques]" aria-describedby="university_faqus" placeholder="Question" value="">
				        							<textarea class="form-control university_info" name="university_faqus[0][ans]" aria-describedby="university_faqus" placeholder="Answer" rows="5"></textarea>
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
									<input type="hidden" name="university_info_type" value="2">
									<textarea class="form-control university_info" name="university_placement_info" id="university_placement_info" rows="10" >
										<?php
										if(!empty($university_data['college_placement_info'])){
											echo $university_data['college_placement_info'];
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
		        						if(!empty($university_data['college_placement_faqs'])){
		        							$j=0;
		        							foreach ($university_data['college_placement_faqs'] as $key => $value) {
		        								?>
		        								<tr id="tr2<?php echo $j;?>">
				        							<td>
					        							<input type="text" class="form-control" name="university_placement_faqs[<?php echo $j;?>][ques]" aria-describedby="college_placement_faqs" placeholder="Question" value="<?php echo $key;?>">
					        						
					        							<textarea class="form-control college_info" name="university_placement_faqs[<?php echo $j;?>][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"><?php echo $value;?></textarea>
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
				        							<input type="text" class="form-control" name="university_placement_faqs[0][ques]" aria-describedby="university_faqus" placeholder="Question" value="">
				        						
				        							<textarea class="form-control university_info" name="university_placement_faqs[0][ans]" aria-describedby="university_placement_faqs" placeholder="Answer" rows="5"></textarea>
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
        						<table class="table table-bordered" id="form_college_scholarship_faqus_table">
		        					<thead>
		        						<tr>
		        							<th>Question/Answer</th>
		        							<th></th>
		        						</tr>
		        					</thead>
		        					<tbody>
		        						<?php
		        						if(!empty($university_data['college_scholarship_faqs'])){
		        							$t=0;
		        							foreach ($university_data['college_scholarship_faqs'] as $key => $value) {
		        								?>
		        								<tr id="tr3<?php echo $t;?>">
				        							<td>
					        							<input type="text" class="form-control" name="university_scholarship_faqs[<?php echo $t;?>][ques]" aria-describedby="college_placement_faqs" placeholder="Question" value="<?php echo $key;?>">

					        							<textarea class="form-control college_info" name="university_scholarship_faqs[<?php echo $t;?>][ans]" aria-describedby="college_faqus" placeholder="Answer" rows="5"><?php echo $value;?></textarea>
					        						</td>

					        						<?php 
					        						if($t==0){
					        							?>
					        							<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_college_scholarship_faqus_row"><i class="fa fa-plus"></i></button></td>
					        							<?php
					        						}else{
					        							?>
					        							<td><button type="button" class="btn btn-xs btn-danger" onclick="$('#tr3<?php echo $t;?>').remove()"><i class="fa fa-minus"></i></button></td>
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
				        							<input type="text" class="form-control" name="university_scholarship_faqs[0][ques]" aria-describedby="university_faqus" placeholder="Question" value="">

				        							<textarea class="form-control university_info" name="university_scholarship_faqs[0][ans]" aria-describedby="university_scholarship_faqs" placeholder="Answer" rows="5"></textarea>
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


						<div class="row buy-now-wrapper">
							<div class="col-sm-3">
								<button class="btn btn-success btn-icon-text mb-2 mb-md-0" type="submit" id="btn_save_university">Save</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>


<?php
if(isset($university_data) && (!empty($university_data))){
	?>

	


	
	<?php

	if(isset($inner_menues_assigned) && !empty($inner_menues_assigned)){

		//print_obj($inner_menues_assigned);
		foreach ($inner_menues_assigned as $key => $value) {

			?>
			<div class="modal fade bd-example-modal-xl" id="<?php echo $value['menu_target_modal'];?>" tabindex="-1" role="dialog" aria-labelledby="<?php echo $value['menu_target_modal'];?>" aria-hidden="true">
				<div class="modal-dialog modal-xl" role="document">
					<div class="modal-content">
						<div class="modal-header">
			                <h5 class="modal-title" id="<?php echo $value['menu_target_modal'];?>"><?php echo $value['menu_name'];?>-<?php echo $value['menu_form'];?></h5>
			                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			            </div>
			            <div class="modal-body">
			            	<?php
			            	//print_obj($value);
			            	?>
			            	<form id="<?php echo $value['menu_form'];?>">
			            		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		            			<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
		            			
		            			<?php
		            			if($value['menu_type_alias_name']=='gallery'){
		            				?>
		            				<div class="row">
			            				<div class="col-sm-6">
											<div class="form-group">
												<label class="control-label">Category</label>
												<select class="form-control" name="college_gallery_category" id="college_gallery_category">
													<option value="0">Select Category</option>
													<?php
													if(!empty($college_data) && !empty($college_data['college_gallery_types'])){
														foreach ($college_data['college_gallery_types'] as $k => $v) {
															?>
															<option value="<?php echo $v->gallery_type_alias;?>"><?php echo $v->gallery_type;?></option>
															<?php
														}
													}
													?>
												</select>
											</div>
										</div>
									
										<div class="col-sm-6" id="college_gallery_image_div">
											<div class="form-group">
												<label>Image</label>
												<input type="file" name="college_gallery_image" id="college_gallery_image" class="file-upload-default">
												<div class="input-group col-xs-12">
													<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Image" value="">
													<span class="input-group-append">
														<button class="file-upload-browse btn btn-primary" type="button">Browse Image</button>
													</span>
												</div>
											</div>
										</div>
										<div class="col-sm-6" id="college_gallery_video_div" style="display: none;">
											<div class="form-group">
												<label>Youtube Video Link</label>
												<input type="text" class="form-control" placeholder="Youtube Video Link" name="college_gallery_video_link" id="college_gallery_video_link" value="">
											</div>
										</div>
									</div>
		            				<?php
		            			}else if($value['menu_type_alias_name']=='faculty'){
		            				?>
		            				<div class="row">
		            					<div class="col-sm-4">
		            						<div class="form-group">
		            							<label>Faculty Name</label>
												<input type="text" class="form-control" placeholder="Faculty Name" name="college_faculty_name" id="college_faculty_name" value="">
		            						</div>
		            					</div>
		            					<div class="col-sm-4">
		            						<div class="form-group">
		            							<label>Faculty Email</label>
												<input type="text" class="form-control" placeholder="Faculty Email" name="college_faculty_email" id="college_faculty_email" value="">
		            						</div>
		            					</div>
		            				
		            					<div class="col-sm-4">
		            						<div class="form-group">
		            							<label>Faculty Phone No.</label>
												<input type="text" class="form-control" placeholder="Faculty Phone No" name="college_faculty_phone_no" id="college_faculty_phone_no" value="">
		            						</div>
		            					</div>
		            				</div>
		            				<div class="row">
		            					<div class="col-sm-4">
		            						<div class="form-group">
		            							<label>Faculty Experience</label>
												<input type="text" class="form-control" placeholder="Faculty Experience" name="college_faculty_experience" id="college_faculty_experience" value="">
		            						</div>
		            					</div>
		            					<div class="col-sm-4">
		            						<div class="form-group">
		            							<label>Faculty Designation</label>
		            							<select class="form-control" name="college_faculty_designation">
		            								<option value="0">Select Designation</option>
		            								<?php
		            								if (!empty($college_data['college_designations'])) {
		            									foreach ($college_data['college_designations'] as $key => $value) {
		            										?>
		            										<option value="<?php echo $value['designation_id'];?>"><?php echo $value['designation_name'];?></option>
		            										<?php
		            									}
		            								}
		            								?>
		            							</select>
		            						</div>
		            					</div>
		            					<div class="col-sm-4">
		            						<div class="form-group">
		            							<label>Faculty Department</label>
		            							<select class="form-control" name="college_faculty_department">
		            								<option value="0">Select Designation</option>
		            								<?php
		            								if (!empty($college_data['college_departments'])) {
		            									foreach ($college_data['college_departments'] as $key => $value) {
		            										?>
		            										<option value="<?php echo $value['department_id'];?>"><?php echo $value['department_name'];?></option>
		            										<?php
		            									}
		            								}
		            								?>
		            							</select>
		            						</div>
		            					</div>
		            				</div>
		            				
		            				<?php
		            			}else if($value['menu_type_alias_name']=='hostel'){
		            				?>
		            				<div class="row">
		            					<div class="col-sm-12">
		            						<div class="form-group">
		            							<label>Hostels [For Men]</label>
												<input type="text" class="form-control" placeholder="Total Cost" name="college_faculty_name" id="college_faculty_name" value="">
		            						</div>
		            					</div>
		            					<div class="col-sm-12">
		            						<table class="table" id="form_hostel_settings_men">
					        					<thead>
					        						<tr><th>Rooms</th>
					        						<th>Non AC Rooms Charges(Per Annum)</th>
					        						<th>AC Rooms Charges(Per Annum)</th>
					        						<th></th>
					        					</tr></thead>
					        					<tbody>
					        						<tr>
						        						<td>
						        							<input type="number" min="0" class="form-control" name="hostel[0][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="" wfd-id="141">
						        						</td>
						        						<td>
						        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="0" value="" wfd-id="140">
						        						</td>
						        						<td>
						        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="0" value="" wfd-id="139">
						        						</td>

						        						<td><button type="button" class="btn btn-sm btn-primary" id="btn_add_hostel_row" wfd-id="151"><i class="fa fa-plus"></i></button></td>
						        					</tr>			
					        					</tbody>
					        				</table>
		            					</div>
		            				</div>
		            				<div class="row">
		            					<div class="col-sm-12">
		            						<div class="form-group">
		            							<label>Hostels [For Women]</label>
												<input type="text" class="form-control" placeholder="Total Cost" name="college_faculty_name" id="college_faculty_name" value="">
		            						</div>
		            					</div>
		            					<div class="col-sm-12">
		            						<table class="table" id="form_hostel_settings_men">
					        					<thead>
					        						<tr><th>Rooms</th>
					        						<th>Non AC Rooms Charges(Per Annum)</th>
					        						<th>AC Rooms Charges(Per Annum)</th>
					        						<th></th>
					        					</tr></thead>
					        					<tbody>
					        						<tr>
						        						<td>
						        							<input type="number" min="0" class="form-control" name="hostel[0][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="" wfd-id="141">
						        						</td>
						        						<td>
						        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="0" value="" wfd-id="140">
						        						</td>
						        						<td>
						        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="0" value="" wfd-id="139">
						        						</td>

						        						<td><button type="button" class="btn btn-sm btn-primary" id="btn_add_hostel_row" wfd-id="151"><i class="fa fa-plus"></i></button></td>
						        					</tr>			
					        					</tbody>
					        				</table>
		            					</div>
		            				</div>
		            				<?php
		            			}
		            			?>
		            			
								<div class="row">
									<div class="col-sm-12">
										<button class="btn btn-primary" type="submit" id="btn_save_<?php echo $value['menu_form'];?>">Save</button>
									</div>
								</div>
			            	</form>
			            </div>
			            <div class="modal-footer">
			            	<div class="table-responsive">
								<table id="<?php echo $value['menu_form'];?>_list_table" class="table">
									<thead>
				                      <tr>
				                      	<?php
				                      	if($value['menu_type_alias_name']=='gallery'){
				                      		?>
				                      		<th>#</th>
					                        <th>File</th>
					                        <th>Type</th>
					                        <th>Action</th>
				                      		<?php
				                      	}else if($value['menu_type_alias_name']=='faculty'){
				                      		?>
				                      		<th>#</th>
					                        <th>Name</th>
					                        <th>Email</th>
					                        <th>Phone No.</th>
					                        <th>Status</th>
					                        <th>Action</th>
				                      		<?php
				                      	}
				                      	?>
				                        
				                      </tr>
				                    </thead>
				                    <tbody>		                    	
				                    </tbody>
								</table>
							</div>
			            </div>
					</div>
				</div>
			</div>
			<?php
		}
	}
}
?>

<style type="text/css">
	#college_inner_menu_other_link_chosen{
		width: 100% !important;
	}

	.grid-square {
	width: 100px;
	height: 100px;
	display: inline-block;
	background-color: #fff;
	border: solid 1px rgb(0,0,0,0.2);
	padding: 10px;
	margin: 12px;
}


</style>


<script type="text/javascript">
	var loadergif='<?php echo base_url('uploads/app/default/carina_loader_animation.gif');?>';
	<?php
	if(!empty($university_data['university_faqs'])){
		?>
		var colleg_faq_row=<?php echo count($university_data['university_placement_faqs']);?>;
		var colleg_placement_faq_row=<?php echo count($university_data['university_placement_faqs']);?>;
		var colleg_scholarship_faq_row=<?php echo count($university_data['university_scholarship_faqs']);?>;
		<?php
	}else{
		?>
		var colleg_faq_row=1;var colleg_placement_faq_row=1;
		var colleg_scholarship_faq_row=1;
		<?php
	}


	if(!empty($cranking_values)){
		?>
		var colleg_ranking_row=<?php echo $cri;?>;
		<?php
	}else{
		?>
		var colleg_ranking_row=1;
		<?php	
	}



	?>
	var _college='<?php echo $university_id;?>';
	var institute_ranking_bodies=<?php echo json_encode($institute_ranking_bodies);?>;
	var institute_ranking_categories=<?php echo json_encode($institute_ranking_categories);?>;
	var institue_ranking_years=<?php echo json_encode($institue_ranking_years);?>;
	var p_row='';


	var colleges_links=<?php echo $college_data_links;?>;
	var university_links=<?php echo $university_data_links;?>;
	var courses_links='';
	var exams_links='';
	var exam_menues='';
	var course_page_question_paper='';
	var course_page_answer_paper='';
	var course_page_speaking_test_paper='';
	var course_page_writing_practice_paper='';
	var course_page_listening_practice_paper='';
	var course_page_sample_practice_paper='';
	var course_page_syllabus_pdfs='';
	var course_page_cutoff_pdfs='';
	var college_type='101';
	var wbpage='university_add_page';
	var page='';
</script>