<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Reviews Data</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title"><?php echo $college_data->college_name;?> REVIEW BY <?php echo $review_data['user_name'];?></h6>
					<p>COURSE:<?php echo $review_data['course_name'];?></p>
					<div class="col-md-12">
						<?php

							if(!empty($review_data['first_step_data'])){
								?>
								<div class="card">
									<div class="card-body">
										<h6 class="card-title"><?php echo strtoupper(str_replace('_', ' ', $review_data['first_step_data']->review_step));?> - Academic Details - 10th & 12th Marks, Exam Scores & Class Size</h6>
										<div class="col-md-12">

											<table class="table table-bordered">
												<tbody>
													<tr>
														<td><h5>Enrollment Year</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_enroll_year'];?></td>
													</tr>
													<tr>
														<td><h5>Program Fees (Year)</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_program_fees'];?></td>
													</tr>
													<tr>
														<td><h5>Board/University [ 12th ]</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_12th_board'];?></td>
													</tr>
													<tr>
														<td><h5>Percentage Mark</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_12th_board_percentage'];?></td>
													</tr>
													<tr>
														<td><h5>Board/University [ 10th ]</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_10th_board'];?></td>
													</tr>
													<tr>
														<td><h5>Percentage Marks</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_10th_board_percentage'];?></td>
													</tr>
													<tr>
														<td><h5>Have you Availed any Quota?</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_caste_quota_applicable'];?></td>
													</tr>
													<tr>
														<td><h5>Quota Type</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_caste_quota'];?></td>
													</tr>
													<tr>
														<td><h5>Was there any GD/PI for the admission</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_gd_pi_applicable'];?></td>
													</tr>
													<tr>
														<td><h5>What was your class size?</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_class_size'];?></td>
													</tr>
													<tr>
														<td><h5>Did you opt for hostels?</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_opt_hostel'];?></td>
													</tr>
													<tr>
														<td><h5>Hostel Fees(Yr)</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_opt_hostel_fees'];?></td>
													</tr>
													<tr>
														<td><h5>Does your college provide placements?</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_inst_placement_applicable'];?></td>
													</tr>
													<tr>
														<td><h5>Does your college provide internship opportunities?</h5></td>
														<td><?php echo $review_data['review_detail_data']['review_inst_internship_applicable'];?></td>
													</tr>
												</tbody>
											</table>
											<table class="table table-bordered">
												<thead>
													<th><h5>Have you applied for any other institute or program?</h5></th>
												</thead>
												<tbody>
													<?php
													if(!empty($review_data['review_other_program_data'])){
														foreach ($review_data['review_other_program_data'] as $key => $value) {
															?>
															<tr>
																<td><?php echo $value->name;?></td>
																<td><?php echo $value->course;?></td>
															</tr>
															<tr>
																<td colspan="2"><?php echo $value->reason;?></td>
															</tr>
															<?php
														}
													}else{
														?>
														<tr><td colspan="2">No data Available</td></tr>
														<?php
													}
													?>
												</tbody>
											</table>


										</div>
									</div>
								</div>
								<?php

								if(!empty($review_data['other_step_data'])){
									$i=1;
									foreach ($review_data['other_step_data'] as $key => $value) {
										?>
										<div class="card">
											<div class="card-body">
												<h6 class="card-title"><?php echo strtoupper(str_replace('_', ' ', $value['review_step']));?></h6>
												<div class="col-md-12">
													<div class="row">
														<div class="col-md-12"><h5>Q<?php echo $i;?>: <?php echo $value['review_question'];?></h5></div>
														<div class="col-md-12"><p style="font-size:14px;"><b>Ans:</b> <?php echo $value['review_question_answer'];?></p></div>
														<div class="col-md-12"><p style="font-size:14px;"><b>Rating:</b> <?php echo $value['review_question_rating'];?>/10</p></div>
													</div>
												</div>
											</div>
										</div>
										<?php
										$i++;
									}
								}

								?>
								<div class="card">
									<div class="card-body">
										<h6 class="card-title">STEP 10</h6>
										<div class="col-md-12">
											<div class="row">
												<div class="col-md-12"><h5>Eligibility for Reward</h5></div>
												<div class="col-md-12"><p>To Be Eligible for the Reward,User has to verify his identity as the student of <b><?php echo $college_data->college_name;?></b> .College ID Card,Marksheet or College Email ID required.</p></div>
											</div>
											<div class="row">
												<table class="table table-bordered">
													<thead>
														<th><h5>Profile Photo</h5></th>
														<th><h5>College Identity Card & other photos</h5></th>
													</thead>
												</table>
											</div>
										</div>
									</div>
								</div>
								<?php
							}

						?>
					</div>

					<div class="col-md-12">
						<form id="form_mark_review">
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<input type="hidden" name="review_id" value="<?php echo $review_data['review_id'];?>">
							<input type="hidden" name="college_id" value="<?php echo $college_id;?>">
							<div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label class="control-label"><strong>Comment</strong></label>
										<textarea class="form-control" name="review_comment" rows="5"><?php echo $review_data['first_step_data']->review_status_comment;?></textarea>

									</div>
								</div>
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label"><strong>Review Status</strong></label>
										<select class="form-control" name="review_status">
											<option value="0">Select Status</option>
											<option value="rejected" <?php echo ($review_data['first_step_data']->review_approved=='rejected')?'selected':'';?>>Rejected</option>
											<option value="approved" <?php echo ($review_data['first_step_data']->review_approved=='approved')?'selected':'';?>>Approved</option>
											<option value="not_approved" <?php echo ($review_data['first_step_data']->review_approved=='not_approved')?'selected':'';?>>Not Approved</option>	
											<option value="incomplete" <?php echo ($review_data['first_step_data']->review_approved=='incomplete')?'selected':'';?>>Incomplete</option>
											<option value="incomplete_and_not_approved" <?php echo ($review_data['first_step_data']->review_approved=='incomplete_and_not_approved')?'selected':'';?>>Incomplete & Not Approved</option>
											<option value="complete_and_not_approved" <?php echo ($review_data['first_step_data']->review_approved=='complete_and_not_approved')?'selected':'';?>>Complete but Not Approved</option>
											<option value="complete_and_not_moderated" <?php echo ($review_data['first_step_data']->review_approved=='complete_and_not_moderated')?'selected':'';?>>Complete but Not Moderated</option>								
										</select>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<button type="submit" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_update_review_status">Update Status</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

</div>

<script type="text/javascript">var p_row='';var _college='<?php echo encode_data($college_id);?>'</script>