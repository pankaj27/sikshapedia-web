<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/institutions/colleges/add/<?php echo $college_id;?>"><?php echo (!empty($college_data))?'Back to '.$college_data['college_name']:'';?></a></li>
			<li class="breadcrumb-item active" aria-current="page"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College Course & Fees Data</li>
		</ol>
	</nav>

	<div class="profile-page tx-13">
		<div class="row">
				<div class="col-md-12 grid-margin stretch-card">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title"><?php echo (!empty($college_data['college_faculties']))?'Update':'Add';?> College - [ <?php echo (!empty($college_data))?$college_data['college_name']:'';?> ]-[ Course & Fees Data]</h6>

							<form id="form_college_courses_fees">
								<input type="hidden" class="form-control" name="_college" value="<?php echo (!empty($college_data))?$college_data['college_id']:'';?>">
								<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
								<input type="hidden" name="college_user_course_pk_id" value="<?php echo !empty($college_data['collge_course_pk_id'])?$college_data['collge_course_pk_id']:'';?>">
								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Course Name</label>
							            	<select class="form-control" id="college_course" name="_course" >
							            		<option value="0">Select Course to Add</option>
												<?php
								            	if(!empty($college_data['college_courses'])){
								            		foreach ($college_data['college_courses'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_id'];?>" <?php echo $value['selected'];?>><?php echo $value['course_name'];?><?php echo $value['course_sub_stream'];?><?php echo $value['course_lateral'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>								            	
						            	</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-6">
										<div class="form-group">
											<label>Total Seats</label>
											<input type="text" class="form-control" name="college_course_seats" placeholder="Seats available" value="<?php echo !empty($college_data['course_seats'])?$college_data['course_seats']:'';?>">
										</div>
									</div>
									<div class="col-sm-6">
										
										<div class="form-group">
											<label>Eligibility</label>
							            	<input type="text" class="form-control" name="college_course_eligibility" placeholder="Eligibility" value="<?php echo !empty($college_data['college_course_eligibility'])?$college_data['college_course_eligibility']:'';?>">								            	
						            	</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Eligibility Description</label>
											<textarea class="form-control" id="college_course_eligibility_broad" rows="10" >
												<?php echo !empty($college_data['course_eligibility_desc'])?$college_data['course_eligibility_desc']:'';?>
											</textarea>
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Course Browser</label>
											<input type="file" name="college_course_broucher" class="file-upload-default">
											<div class="input-group col-xs-12">
												<input type="text" class="form-control file-upload-info" disabled="" placeholder="Browse Broucher" value="" id="college_course_broucher">
												<span class="input-group-append">
													<button class="file-upload-browse btn btn-primary" type="button">Browse Broucher</button>
												</span>
											</div>
										</div>
									</div>
								</div>

								<h6>Course Duration</h6>
								<hr>
								<div class="row">
									<div class="col-sm-6">
										<div class="form-group">
											<label>Course Duration (Years)</label>
							            	<select class="form-control" id="course_duration" name="course_duration">
							            		<option value="0">Select Course Duration</option>
												<?php
								            	if(!empty($college_data['college_course_duration'])){
								            		foreach ($college_data['college_course_duration'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_duration_year'];?>" <?php echo $value['selected'];?>><?php echo $value['course_duration_year'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>								            	
						            	</div>
									</div>
									<div class="col-sm-3">
										<div class="form-group">
											<label>Course Duration Type</label>
							            	<select class="form-control" id="course_duration_type" name="course_duration_type" >
							            		<option value="0">Select Duration Type</option>
												<?php
								            	if(!empty($college_data['course_duration_types'])){
								            		foreach ($college_data['course_duration_types'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['duration_type'];?>" <?php echo $value['selected'];?>><?php echo $value['duration_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>							            	
						            	</div>
									</div>
									<div class="col-sm-63">
										<div class="form-group">
											<label>Course Duration Sub Type</label>
							            	<select class="form-control" id="course_duration_sub_type" name="course_duration_sub_type" >
							            		<option value="0">Select Duration Sub Type</option>
												<?php
								            	if(!empty($college_data['course_duration_sub_type'])){
								            		foreach ($college_data['course_duration_sub_type'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['duration_sub_type'];?>" <?php echo $value['selected'];?>><?php echo $value['duration_sub_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>							            	
						            	</div>
									</div>
								</div>

								<h6>Others</h6>
								<hr>
								<div class="row">
									<div class="col-sm-3">
										<div class="form-group">
											<label>Course Type</label>
							            	<select class="form-control" id="course_type" name="course_type" >
							            		<option value="0">Select Course Type</option>
												<?php
								            	if(!empty($college_data['college_course_types'])){
								            		foreach ($college_data['college_course_types'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_type'];?>" <?php echo $value['selected'];?>><?php echo $value['course_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>
								            	
						            	</div>
									</div>
									<div class="col-sm-2">
										<div class="form-group">
											<label>Course Pass Type</label>
							            	<select class="form-control" id="course_pass_type" name="course_pass_type" >
							            		<option value="0">Select Course Pass Type</option>
												<?php
								            	if(!empty($college_data['college_course_pass_types'])){
								            		foreach ($college_data['college_course_pass_types'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['course_pass_type'];?>" <?php echo $value['selected'];?>><?php echo $value['course_pass_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>
								            	
						            	</div>
									</div>
								
									<div class="col-sm-3">
										<div class="form-group">
											<label>Placement Type</label>
							            	<select class="form-control" id="course_placement_type" name="course_placement_type" >
							            		<option value="0">Select Placement Type</option>
												<?php
								            	if(!empty($college_data['college_placement_types'])){
								            		foreach ($college_data['college_placement_types'] as $key => $value) {
								            			?>
								            			<option value="<?php echo $value['placement_type'];?>" <?php echo $value['selected'];?>><?php echo $value['placement_type'];?></option>
								            			<?php
								            		}
								            	}
								            	?>
							            	</select>	
						            	</div>
									</div>
									<div class="col-sm-2">
										<div class="form-group">
											<label>Cost Type</label>
											<select class="form-control" id="course_cost_type" name="course_cost_type">
												<?php
												if(!empty($college_data['course_cost_types'])){
													foreach ($college_data['course_cost_types'] as $key => $value) {
														?>
														<option value="<?php echo $value['cost_key'];?>" <?php echo $value['selected'];?>><?php echo $value['cost_value'];?></option>
														<?php
													}
												}
												?>
											</select>
										</div>
									</div>
									<div class="col-sm-2">
										<div class="form-group">
											<label>Cost Breakup Type</label>
											<select class="form-control" id="course_cost_breakup_type" name="course_cost_breakup_type">
												<?php
												if(!empty($college_data['course_cost_breakup_types'])){
													foreach ($college_data['course_cost_breakup_types'] as $key => $value) {
														?>
														<option value="<?php echo $value['cost_breakup_key'];?>" <?php echo $value['selected'];?>><?php echo $value['cost_breakup_value'];?></option>
														<?php
													}
												}
												?>
											</select>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-3">
										<div class="form-group" id="cost_category_div">
											<label>Cost Category</label>
											<br>
											<?php
											if(!empty($college_data['course_cost_categories'])){
												foreach ($college_data['course_cost_categories'] as $key => $value) {
													?>
													<input type="checkbox" class="course_cost_categories" name="course_cost_categories[]" value="<?php echo $value['category_id'];?>" data-category="<?php echo $value['category_name'];?>" data-categorytable="course_price_list_table<?php echo str_replace('/', '_', $value['category_name']);?>" <?php echo $value['selected'];?>><span style="padding-left: 10px;"><?php echo $value['category_name'];?></span><br>
													<?php
												}
											}
											?>
										</div>
									</div>
								</div>

								<?php

								if(!empty($college_data['course_cost_categories'])){

									//echo decode_data('Qkte5TxCM2uZgVKiUi0cYreBxH3L3XxLl983IlKpmS.D1wH3RVx3bmNHIuQ9muUNdefybCc0ZoyT6zBXmiUBwA--');

									//print_obj($college_data);
									$i=0;
									foreach ($college_data['course_cost_categories'] as $key => $value) {
										
										?>
										<div class="row" id="cos_row<?php echo $value['category_name'];?>">
											<div class="col-sm-12">
												<div class="form-group"><label style="font-weight: bold;">Course Cost (Category:<?php echo $value['category_name'];?>-<?php echo $college_data['course_cost_type'];?>)</label>
													<div class="table-responsive">
														<table class="table" id="course_price_list_table<?php echo str_replace('/', '_', $value['category_name']);?>">
										                    <thead>
											                    <tr>
											                        <th>Year</th>
											                        <th>Tuition Fees(<?php echo $user_currency;?>)</th>
											                        <th>Admission Fees(<?php echo $user_currency;?>)</th>
											                        <th>Registration Fees(<?php echo $user_currency;?>)</th>
											                        <th>Exam Fees(<?php echo $user_currency;?>)</th>
											                        <th>Other Fees(<?php echo $user_currency;?>)</th>
											                    </tr>
											                </thead>
											                <tbody>
											                	<?php
											                	//print_obj($value['course_cost']);
											                	if(!empty($value['course_cost'])){

											                		$total=0;
											                		if($college_data['course_cost_breakup_type']=='2'){
											                			$readonly='readonly';
											                		}else{
											                			$readonly='';
											                		}
											                		if($college_data['course_cost_type']=='1'){
											                			$yeari=1;
											                			foreach ($value['course_cost'] as $k => $v){
											                				?>
											                				<tr>
																              <td><?php echo ordinal($yeari);?> Year <input type="hidden" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $yeari;?>][course_year]" value="<?php echo $yeari;?>" <?php echo $readonly;?>></td>
																              <td>
																              <input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_tution_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $yeari;?>][course_tution_total]" <?php echo $readonly;?>>
																              </td>
																              <td>
																              <input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_admisssion_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $yeari;?>][course_admission_total]" <?php echo $readonly;?>>
																              </td>
																               <td>
																              <input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_reg_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $yeari;?>][course_reg_total]" <?php echo $readonly;?>>
																              </td>
																               <td>
																              <input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_exam_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $yeari;?>][course_exam_total]" <?php echo $readonly;?>>
																              </td>
																               <td>
																              <input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_other_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $yeari;?>][course_other_total]" <?php echo $readonly;?>>
																              </td>
																            <tr>
											                				<?php
											                				$total+=$v->user_course_total_fee;

											                				$yeari++;

												                		}
											                		}else if($college_data['course_cost_type']=='2'){

											                			$yeari=1;
											                			foreach ($value['course_cost'] as $k => $v){
											                				?>
											                				<tr>
											                					<td><?php echo ordinal($yeari);?> Year <input type="hidden" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_year]" value="<?php echo $yeari;?>"></td>
											                					<td>
												                					<table class="table">
												                						<tbody>
												                							<tr>
												                								<td><label>Semester 1</label></br>
												                								<input class="form-control" type="number" min="0" aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_tution_fee_sem_1]" value="<?php echo $v->user_course_tution_fee_sem_1;?>"></td>
												                							</tr>
												                							<tr>
												                								<td>
												                									<label>Semester 2</label></br>
												                									<input class="form-control" type="number" min="0" aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_tution_fee_sem_2]" value="<?php echo $v->user_course_tution_fee_sem_2;?>">
												                								</td>
												                							</tr>
												                						</tbody>
												                					</table>
												                				</td>
												                				<td>
												                					<table>
												                						<tbody>
												                							<tr>
												                								<td>
												                									<label>Semester 1</label></br>
												                									<input class="form-control" type="number" min="0"aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_admisssion_fee_sem_1]" value="<?php echo $v->user_course_admisssion_fee_sem_1;?>">
												                								</td>
												                							</tr>
												                							<tr>
												                								<td>
												                									<label>Semester 2</label></br>
												                									<input class="form-control" type="number" min="0" aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_admisssion_fee_sem_2]" value="<?php echo $v->user_course_admisssion_fee_sem_2;?>">
												                								</td>
												                							</tr>
												                						</tbody>
												                					</table>
												                				</td>
												                				<td>
												                					<table>
												                						<tbody>
												                							<tr>
												                								<td>
												                									<label>Semester 1</label></br>
												                									<input class="form-control" type="number" min="0"aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $i;?>][course_reg_fee_sem_1]" value="<?php echo $v->user_course_reg_fee_sem_1;?>">
												                								</td>
												                							</tr>
												                							<tr>
												                								<td>
												                									<label>Semester 2</label></br>
												                									<input class="form-control" type="number" min="0" aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_reg_fee_sem_2]" value="<?php echo $v->user_course_reg_fee_sem_2;?>">
												                								</td>
												                							</tr>
												                						</tbody>
												                					</table>
												                				</td>
												                				<td>
												                					<table>
												                						<tbody>
												                							<tr>
												                								<td>
												                									<label>Semester 1</label></br>
												                									<input class="form-control" type="number" min="0" aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_exam_fee_sem_1]" value="<?php echo $v->user_course_exam_fee_sem_1;?>">
												                								</td>
												                							</tr>
												                							<tr>
												                								<td>
												                									<label>Semester 2</label></br>
												                									<input class="form-control" type="number" min="0" aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_exam_fee_sem_2]" value="<?php echo $v->user_course_exam_fee_sem_2;?>">
												                								</td>
												                							</tr>
												                						</tbody>
												                					</table>
												                				</td>
												                				<td>
												                					<table>
												                						<tbody>
												                							<tr>
												                								<td>
												                									<label>Semester 1</label></br>
												                									<input class="form-control" type="number" min="0" aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_other_fee_sem_1]" value="<?php echo $v->user_course_other_fee_sem_1;?>">
												                								</td>
												                							</tr>
												                							<tr>
												                								<td>
												                									<label>Semester 2</label></br>
												                									<input class="form-control" type="number" min="0" aria-invalid="false" name="registration_course_fees[<?php echo $value['category_name'];?>][<?php echo $yeari;?>][course_other_fee_sem_2]" value="<?php echo $v->user_course_other_fee_sem_2;?>">
												                								</td>
												                							</tr>
												                						</tbody>
												                					</table>
												                				</td>
											                				</tr>
											                				<?php

											                				$yeari++;

												                		}												                		
											                		}


											                		if($college_data['course_cost_breakup_type']=='2'){
											                			?>
											                			<tr>
																            <td colspan="4"></td>
																            <td>Total</td>
																            <td>
																              <input type="number" class="form-control" min="0" aria-invalid="false" name="registration_course_fees_total[<?php echo $v->user_course_cost_category;?>]" value="<?php echo $total;?>">
																            </td>
															            </tr>
											                			<?php
											                		}
											                	
											                	}
											                	?>
											                </tbody>
											            </table>
													</div>
												</div>
											</div>
										</div>
										<hr>
										<?php
										$i++;
									}
								}


								

								?>
								

								<br>

								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label>Tag Streams</label>
											<?php //print_obj($college_data['college_streams']);?>
											<br>
											<?php
											if(!empty($college_data['college_streams'])){

												?>
												<select class="form-control" multiple="true" name="course_streams[]" id="course_streams">
													<?php
													foreach ($college_data['college_streams'] as $key => $value){
														?>
														<option value="<?php echo $value['stream_id'];?>" <?php echo $value['selected'];?>><?php echo $value['stream_name'];?></option>
														<?php
													}
													?>
												</select>
												<?php



											}
											?>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-6">
										<div class="form-group">
											<label>Tag Sub Streams</label>
											<br>
											<?php
											if(!empty($college_data['college_sub_streams'])){

												?>
												<select class="form-control" multiple="true" name="course_sub_streams[]" id="course_sub_streams">
													<?php
													foreach ($college_data['college_sub_streams'] as $key => $value){
														?>
														<option value="<?php echo $value['stream_id'];?>" <?php echo $value['selected'];?>><?php echo $value['stream_name'];?></option>
														<?php
													}
													?>
												</select>
												<?php



											}
											?>
										</div>
									</div>
									<div class="col-sm-6">
										<div class="form-group">
											<label>Tag Exams</label>
											<br>
											<?php
											if(!empty($college_data['college_exams'])){
												?>
												<select class="form-control" multiple="true" name="course_exams[]" id="course_exams">
													<?php
													foreach ($college_data['college_exams'] as $key => $value){
														?>
														<option value="<?php echo $value['exam_id'];?>" <?php echo $value['selected'];?>><?php echo $value['exam_short_name'];?></option>
														<?php
													}
													?>
												</select>
												<?php												
											}
											?>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-12">
							           <button type="submit" class="btn btn-primary" id="btn_save_course">Save</button>
							        </div>
							    </div>
							</form>
						</div>
					</div>
				</div>
			</div>
	</div>
</div>

<script type="text/javascript">
	let selected_dy_last_val=<?php echo isset($j)?$j:1;?>;
	let colleg_faq_row ='';
	let _college='<?php echo (!empty($college_data))?$college_data['college_id']:'';?>';

	let cost_html='';

	var college_type='<?php echo $college_type;?>';
	var _ur='';
	var colleg_ranking_row='';
	var colleg_placement_faq_row='';
	var colleg_scholarship_faq_row='';
	var ytrow ='0';
	
	<?php	
	if(!empty($college_data['course_cost'])){
		$j=1;
		foreach ($college_data['course_cost'] as $key => $value) {
		?>
		cost_html+='<tr>';
			cost_html+='<td><?php echo $value['user_course_year_ordinal'];?> Year <input type="hidden" name="registration_course_fees[<?php echo $j;?>][course_year]" value="<?php echo $value['user_course_year'];?>"></td>';
			cost_html+='<td>';
				cost_html+='<table class="table">';
					cost_html+='<tbody>';
						cost_html+='<tr>';
							cost_html+='<td><label>Semester 1</label></br>';
							cost_html+='<input type="number" min="0" class="valid" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_tution_fee_sem_1]" value="<?php echo $value['user_course_tution_fee_sem_1'];?>"></td>';
						cost_html+='</tr>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 2</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_tution_fee_sem_2]" value="<?php echo $value['user_course_tution_fee_sem_2'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
					cost_html+='</tbody>';
				cost_html+='</table>';
			cost_html+='</td>';
			cost_html+='<td>';
				cost_html+='<table>';
					cost_html+='<tbody>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 1</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_admisssion_fee_sem_1]" value="<?php echo $value['user_course_admisssion_fee_sem_1'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 2</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_admisssion_fee_sem_2]" value="<?php echo $value['user_course_admisssion_fee_sem_2'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
					cost_html+='</tbody>';
				cost_html+='</table>';
			cost_html+='</td>';
			cost_html+='<td>';
				cost_html+='<table>';
					cost_html+='<tbody>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 1</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_reg_fee_sem_1]" value="<?php echo $value['user_course_reg_fee_sem_1'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 2</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_reg_fee_sem_2]" value="<?php echo $value['user_course_reg_fee_sem_2'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
					cost_html+='</tbody>';
				cost_html+='</table>';
			cost_html+='</td>';
			cost_html+='<td>';
				cost_html+='<table>';
					cost_html+='<tbody>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 1</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_exam_fee_sem_1]" value="<?php echo $value['user_course_exam_fee_sem_1'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 2</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_exam_fee_sem_2]" value="<?php echo $value['user_course_exam_fee_sem_2'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
					cost_html+='</tbody>';
				cost_html+='</table>';
			cost_html+='</td>';
			cost_html+='<td>';
				cost_html+='<table>';
					cost_html+='<tbody>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 1</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_other_fee_sem_1]" value="<?php echo $value['user_course_other_fee_sem_1'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
						cost_html+='<tr>';
							cost_html+='<td>';
								cost_html+='<label>Semester 2</label></br>';
								cost_html+='<input type="number" min="0" class="" aria-invalid="false" name="registration_course_fees[<?php echo $j;?>][course_other_fee_sem_2]" value="<?php echo $value['user_course_other_fee_sem_2'];?>">';
							cost_html+='</td>';
						cost_html+='</tr>';
					cost_html+='</tbody>';
				cost_html+='</table>';
			cost_html+='</td>';
		cost_html+='</tr>';
		<?php
		$j++;
		}
	}
	?>

	<?php

	if(!empty($college_data['course_cost_categories'])){
		$i=0;
		foreach ($college_data['course_cost_categories'] as $key => $value) {
        	if(!empty($value['course_cost'])){
        		if($college_data['course_cost_type']=='1'){
        			$i=1;
        			foreach ($value['course_cost'] as $k => $v){
        				?>
        				cost_html='<tr>';
			              cost_html+='<td><?php echo ordinal($i);?> Year <input type="hidden" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $i;?>][course_year]" value="<?php echo $i;?>"></td>';
			              cost_html+='<td>';
			              cost_html+='<input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_tution_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $i;?>][course_tution_total]">';
			              cost_html+='</td>';
			              cost_html+='td>';
			              cost_html+='<input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_admisssion_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $i;?>][course_admission_total]">';
			              cost_html+='</td>';
			               cost_html+='<td>';
			              cost_html+='<input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_reg_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $i;?>][course_reg_total]">';
			              cost_html+='</td>';
			               cost_html+='<td>';
			              cost_html+='<input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_exam_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $i;?>][course_exam_total]">';
			              cost_html+='</td>';
			               cost_html+='<td>';
			              cost_html+='<input type="number" class="form-control" min="0" class="" value="<?php echo $v->user_course_other_fee_total;?>" aria-invalid="false" name="registration_course_fees[<?php echo $v->user_course_cost_category;?>][<?php echo $i;?>][course_other_total]">';
			              cost_html+='</td>';
			            cost_html+='<tr>';
        				<?php
        				$i++;

            		}
        		}else if($college_data['course_cost_type']=='2'){
        			foreach ($college_data['course_cost'] as $key => $value){

            		}												                		
        		}
        	
        	}
        	?>
			<?php
			$i++;
		}
	}

	?>


	$(document).ready(function(){

		tiny_mce('.college_info')


		function tinyMceEditLinkFrom(editor) {
		    editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
		    editor.windowManager.open = function (t, r) {    // replace with our own function
		        var modal = this.oldOpen.apply(this, [t, r]);  // call original

		        var h='';
		        h+='<select class="form-control" id="search_form">';
		        h+='<option value="exam">Search from exams</option>';
		        h+='<option value="exam_menu">Search from exams menu</option>';
		        h+='<option value="college">Search from college</option>';
		        h+='<option value="college_menu">Search from college menu</option>';
		        h+='<option value="courses">Search from course</option>';
		        h+='</select>'

		        if (t.title === "Insert/Edit Link") {
		            $('.tox-dialog__footer-end').append(h);

		            $('#custom_button').on('click', function () {
		                //Replace this with your custom function
		                console.log('Running custom function')
		            });
		        }

		        return modal; // Template plugin is dependent on this return value
		    };
		}


		function tinyMceEditLinkSearch(editor,mode){

			//console.log(mode);

			//if (mode=='no') {
				editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
			    editor.windowManager.open = function (t, r) {    // replace with our own function
			        var modal = this.oldOpen.apply(this, [t, r]);  // call original
			        var h='';
			        h+='<select class="form-control" id="search_form">';
			        h+='<optgroup label="Exams">';
			        h+='<option value="exam">Search from exams</option>';
			        h+='</optgroup>';
			        h+='<optgroup label="Colleges & Universities">';
			        h+='<option value="college">Search from college</option>';
			        h+='<option value="universities">Search from universities</option>';
			        h+='</optgroup>';
			        h+='<optgroup label="Streams & Courses">';
			        h+='<option value="streams">Search from streams</option>';
			        h+='<option value="courses">Search from course</option>';
			        h+='</optgroup>';
			        h+='</select>'

			        if (t.title === "Insert/Edit Link") {
			            $('.tox-form').prepend('<div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false">'+h+'<div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div><div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false"><input type="text" role="combobox" aria-autocomplete="list" aria-haspopup="true" tabindex="-1" class="tox-textfield jAuto" aria-expanded="false" id="search-box"><div id="suggesstion-box"><ul id="search_tag-list"></ul></div><div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div>'
			            );

			            $('.tox-dialog__footer-end').prepend(
			                '<button title="Custom button" type="button" data-alloy-tabstop="true" tabindex="-1" class="tox-button" id="custom_button">Search</button>'
			            );
			        }

			        return modal; // Template plugin is dependent on this return value
			    };
			// }else{
			// 	editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
			//     editor.windowManager.open = function (t, r) {    // replace with our own function
			//         var modal = this.oldOpen.apply(this, [t, r]);  // call original

			//         if (t.title === "Insert/Edit Image") {

			//             $('.tox-dialog__footer-end').prepend(
			//                 '<button title="Custom button" type="button" data-alloy-tabstop="true" tabindex="-1" class="tox-button" id="custom_button">Search</button>'
			//             );
			//         }

			//         return modal; // Template plugin is dependent on this return value

			//     };
			// }

			  
		}

		var timny_mce_image_mode_val = 'yes';
		localStorage.setItem('timny_mce_image_mode',"no")

		function tiny_mce(ctrl_area){
			tinymce.init({
			  selector: ctrl_area,
			  entity_encoding : "raw",
			  height: 400,
			  theme: 'silver',
			  font_formats:"UbuntuCondensed-Regular;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
			  plugins: [
			    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
			    'searchreplace wordcount visualblocks visualchars code fullscreen table',
			  ],
			  toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
			  toolbar2: 'forecolor backcolor emoticons | codesample',
			  table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
			  setup: function(editor) {
			  	// editor.ui.registry.addButton('image_mode_activate', {
			    //   text: 'Activate Image Mode',
			    //   type: 'button',
			    //   onAction: function () {
			    //     // handle checkbox click event
			    //     localStorage.setItem('timny_mce_image_mode',"yes");
			    //     //tinyMceEditLinkSearch(editor,localStorage.timny_mce_image_mode);
			    //   }
			    // });
			    // editor.ui.registry.addButton('link_mode_activate', {
			    //   text: 'Activate Link Mode',
			    //   type: 'button',
			    //   onAction: function () {
			    //     // handle checkbox click event
			    //     localStorage.setItem('timny_mce_image_mode',"no");
			    //     //tinyMceEditLinkSearch(editor,localStorage.timny_mce_image_mode);
			    //   }
			    // });
			    // Register our custom button callback function
			    editor.on('init',function(e) {
			        //tinyMceEditLink(editor);
			        tinyMceEditLinkSearch(editor,localStorage.timny_mce_image_mode);
			    });

			  },
			  table_appearance_options: true,
			  table_use_colgroups: true
			});
		}





	});

</script>