<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/institutions/colleges/add/<?php echo $college_id;?>"><?php echo (!empty($college_data))?$college_data['college_name']:'';?></a></li>
			<li class="breadcrumb-item active" aria-current="page"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College Hostel Data</li>
		</ol>
	</nav>



	<?php
	if(isset($college_data) && (!empty($college_data))){
		?>
		<div class="profile-page tx-13">
			<div class="row">
	            <div class="col-12 grid-margin">
					<div class="profile-header">
						<div class="cover">
							<div class="gray-shade"></div>
							<figure>
								<img src="<?php echo (!empty($college_banner))?$college_banner:'';?>" class="img-fluid" alt="profile cover" style="height: 300px;">
							</figure>
							<div class="cover-body d-flex justify-content-between align-items-center">
								<div>
									<img class="profile-pic" src="<?php echo (!empty($college_logo))?$college_logo:'';?>" alt="profile">
									<a href="<?php echo (!empty($college_data))?$college_data['college_access_url']:'';?>" target="_blank"><span class="profile-name"><?php echo (!empty($college_data))?$college_data['college_name']:'';?></span></a>
								</div>
							</div>
						</div>
						<div class="header-links">
							<ul class="links d-flex align-items-center mt-3 mt-md-0">
								<li class="header-link-item d-flex align-items-center active">
									<button class="btn btn-primary btn-icon-text btn-edit-profile" data-toggle="modal" data-target="#collegeInnerMenuesModal"> Create inner Menues</button>
								</li>
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
		?>
		<div class="profile-page tx-13">
			<div class="row">
				<div class="col-md-12 grid-margin stretch-card">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College - [ <?php echo (!empty($college_data))?$college_data['college_name']:'';?> ]-[ Hostel Data (For Men)]</h6>
							<form id="form_college_hostel_men">
								<input type="hidden" class="form-control" name="_hostel_data_id" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
								<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
								<input type="hidden" name="_hostel_data_type" value="2">
								<input type="hidden" name="_hostel_type" value="2">
								<div class="row">
									<div class="col-sm-12">
										<div class="col-sm-3">
											<input type="radio" id="hostel_details_type_general_men" name="hostel_details_type_men" class="radio" value="1"  <?php echo (!empty($college_data['college_hostel_data']['men_hostel_detail_type']) && ($college_data['college_hostel_data']['men_hostel_detail_type']=='1'))?'checked':'';?>> General Details
										</div>
										<div class="col-sm-3">
											<input type="radio" id="hostel_details_type_specific_men" name="hostel_details_type_men" class="radio" value="2" <?php echo (!empty($college_data['college_hostel_data']['men_hostel_detail_type']) && ($college_data['college_hostel_data']['men_hostel_detail_type']=='2'))?'checked':'';?>> Specific Details
										</div>
									</div>
								</div>

								<div class="row" id="form_hostel_settings_men_general_div" <?php echo (!empty($college_data['college_hostel_data']['men_hostel_detail_type']) && ($college_data['college_hostel_data']['men_hostel_detail_type']=='1'))?'style="display: block;"':'style="display: none;"';?>>
	            					<div class="col-sm-12">
	            						<table class="table" id="form_hostel_settings_men">
				        					<thead>
				        						<tr>
				        							<th>Fees Starting Range</th>
				        							<th>Fees Ending Range</th>
				        						</tr>
				        					</thead>
				        					<tbody>
				        						<tr>
				        							<td>
					        							<input type="number" min="0" class="form-control" name="fees_start_range" aria-describedby="hostel_rooms" placeholder="Starting Range" value="<?php echo (!empty($college_data['college_hostel_data']['men_hostel_total_fees_start']))?$college_data['college_hostel_data']['men_hostel_total_fees_start']:'0';?>">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="fees_end_range" aria-describedby="hostel_rooms" placeholder="Ending range" value="<?php echo (!empty($college_data['college_hostel_data']['men_hostel_total_fees_end']))?$college_data['college_hostel_data']['men_hostel_total_fees_end']:'';?>">
					        						</td>
					        					</tr>			
				        					</tbody>
				        				</table>
	            					</div>
	            				</div>

								<div class="row" id="form_hostel_settings_men_specific_div" <?php echo (!empty($college_data['college_hostel_data']['men_hostel_detail_type']) && ($college_data['college_hostel_data']['men_hostel_detail_type']=='2'))?'style="display: block;"':'style="display: none;';?>>
	            					<div class="col-sm-12">
	            						<table class="table" id="form_hostel_settings_men">
				        					<thead>
				        						<tr>
				        							<th>Name of the Residence</th>
				        							<th>Rooms</th>
				        							<th>Non AC Rooms Charges(Per Annum)</th>
				        							<th>AC Rooms Charges(Per Annum)</th>
				        							<th></th>
				        						</tr>
				        					</thead>
				        					<tbody>
				        						<tr>
				        							<td>
					        							<input type="number" min="0" class="form-control" name="hostel[0][name]" aria-describedby="hostel_rooms" placeholder="Name of the Residence" value="">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[0][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="Non AC Rooms Charges(Per Annum)" value="">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="AC Rooms Charges(Per Annum)" value="">
					        						</td>

					        						<td><button type="button" class="btn btn-sm btn-primary" id="btn_add_hostel_men_row"><i class="fa fa-plus"></i></button></td>
					        					</tr>			
				        					</tbody>
				        				</table>
	            					</div>
	            				</div>

	            				<div class="row">
	            					<div class="col-sm-12">
	            						<div class="form-group">
	            							<label class="control-label">Notes</label>
	            							<textarea class="form-control college_info" name="college_hostel_info" id="college_hostel_info" rows="10" >
												<?php
												if(!empty($college_data['college_hostel_data']['men_hostel_note'])){
													echo $college_data['college_hostel_data']['men_hostel_note'];
												}
												?>
											</textarea>
	            						</div>
	            					</div>
	            				</div>

	            				<div class="row">
									<div class="col-sm-12">
										<button class="btn btn-primary" type="submit" id="btn_save_form_hostel_men">Save</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12 grid-margin stretch-card">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College - [ <?php echo (!empty($college_data))?$college_data['college_name']:'';?> ]-[ Hostel Data (For Women)]</h6>
							<form id="form_college_hostel_women">
								<input type="hidden" class="form-control" name="_hostel_data_id" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
								<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
								<input type="hidden" name="_hostel_data_type" value="2">
								<input type="hidden" name="_hostel_type" value="1">

								<div class="row">
									<div class="col-sm-12">
										<div class="col-sm-3">
											<input type="radio" id="hostel_details_type_general_women" name="hostel_details_type_women" value="1" class="radio" <?php echo (!empty($college_data['college_hostel_data']['women_hostel_detail_type']) && ($college_data['college_hostel_data']['women_hostel_detail_type']=='1'))?'checked':'';?>> General Details
										</div>
										<div class="col-sm-3">
											<input type="radio" id="hostel_details_type_specific_women" name="hostel_details_type_women" value="2" class="radio"  <?php echo (!empty($college_data['college_hostel_data']['women_hostel_detail_type']) && ($college_data['college_hostel_data']['women_hostel_detail_type']=='2'))?'checked':'';?>> Specific Details
										</div>
									</div>
								</div>

								<div class="row" id="form_hostel_settings_women_general_div" <?php echo (!empty($college_data['college_hostel_data']['women_hostel_detail_type']) && ($college_data['college_hostel_data']['women_hostel_detail_type']=='1'))?'style="display: block;"':'style="display: none;"';?>>
	            					<div class="col-sm-12">
	            						<table class="table" id="form_hostel_settings_women">
				        					<thead>
				        						<tr>
				        							<th>Fees Starting Range</th>
				        							<th>Fees Ending Range</th>
				        						</tr>
				        					</thead>
				        					<tbody>
				        						<tr>
				        							<td>
					        							<input type="number" min="0" class="form-control" name="fees_start_range" aria-describedby="hostel_rooms" placeholder="Starting Range" value="<?php echo (!empty($college_data['college_hostel_data']['women_hostel_total_fees_start']))?$college_data['college_hostel_data']['women_hostel_total_fees_start']:'0';?>">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="fees_end_range" aria-describedby="hostel_rooms" placeholder="Ending range" value="<?php echo (!empty($college_data['college_hostel_data']['men_hostel_total_fees_end']))?$college_data['college_hostel_data']['men_hostel_total_fees_end']:'';?>">
					        						</td>
					        					</tr>			
				        					</tbody>
				        				</table>
	            					</div>
	            				</div>

	            				<div class="row" id="form_hostel_settings_women_specific_div" <?php echo (!empty($college_data['college_hostel_data']['women_hostel_detail_type']) && ($college_data['college_hostel_data']['women_hostel_detail_type']=='2'))?'style="display: block;"':'style="display: none;';?>>
	            					<div class="col-sm-12">
	            						<table class="table" id="form_hostel_settings_women">
				        					<thead>
				        						<tr>
				        						<th>Name of the Residence</th>
				        						<th>Rooms</th>
				        						<th>Non AC Rooms Charges(Per Annum)</th>
				        						<th>AC Rooms Charges(Per Annum)</th>
				        						<th></th>
				        						</tr>
				        					</thead>
				        					<tbody>
				        						<tr>
				        							<td>
					        							<input type="number" min="0" class="form-control" name="hostel[0][name]" aria-describedby="hostel_rooms" placeholder="Name of the Residence" value="">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[0][rooms]" aria-describedby="hostel_rooms" placeholder="Rooms" value="">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_non_ac_charges]" aria-describedby="hostel_rooms_non_ac_charges" placeholder="Non AC Rooms Charges(Per Annum)" value="">
					        						</td>
					        						<td>
					        							<input type="number" min="0" class="form-control" name="hostel[0][rooms_ac_charges]" aria-describedby="hostel_rooms_ac_charges" placeholder="AC Rooms Charges(Per Annum)" value="">
					        						</td>

					        						<td><button type="button" class="btn btn-sm btn-primary" id="btn_add_hostel_row_women"><i class="fa fa-plus"></i></button></td>
					        					</tr>			
				        					</tbody>
				        				</table>
	            					</div>
	            				</div>

	            				<div class="row">
	            					<div class="col-sm-12">
	            						<div class="form-group">
	            							<label class="control-label">Notes</label>
	            							<textarea class="form-control college_info" name="college_hostel_info" id="college_hostel_info" rows="10" >
												<?php
												if(!empty($college_data['college_hostel_data']['women_hostel_note'])){
													echo $college_data['college_hostel_data']['women_hostel_note'];
												}
												?>
											</textarea>
	            						</div>
	            					</div>
	            				</div>

	            				<div class="row">
									<div class="col-sm-12">
										<button class="btn btn-primary" type="submit" id="btn_save_form_hostel_women">Save</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
	?>
</div>

<script type="text/javascript">let _college='<?php echo (!empty($college_data))?$college_data['college_id']:'';?>';var college_type='<?php echo $college_type ;?>';</script>