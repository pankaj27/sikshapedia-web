<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">College Review Add</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-title">
					<h6 class="card-header">Add Review for <a href="<?php echo $college_data->access_url;?>" target="_blank"><?php echo $college_data->college_name;?></a> <a href="<?php echo $back_link;?>" class="btn btn-sm btn-primary" style="float:right !important;">Back</a></h6>
				</div>
				<div class="card-body">
					
					<div class="row" style="margin-top:-20px !important;">
						<form id="form_review_step_1" style="width:100% !important;">
							<input type="hidden" name="review_unique_id" id="review_unique_id" value="<?php echo $review_id;?>">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_1">
			              	<input type="hidden" name="review_step" id="review_step" value="step_2">
			              	<input type="hidden" name="review_course" value="<?php echo encode_data($inst_data['inst_course_id']);?>">
			              	<input type="hidden" name="review_q_type" value=""> 
			              	<input type="hidden" name="review_status_change" value="no">             
			              	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
			              	<div class="row">
				              	<div class="col-lg-6">
				              		<label>Review As (Anonymous Users)</label>
				              		<select class="form-control" name="review_user_id" id="review_user_id">
				              			<?php
				              			foreach ($anonymus_ids as $key => $value) {
				              				?>
				              				<option value="<?php echo $key;?>" <?php echo (!empty($review_data) && ($review_data->review_user_anonymus_id==$key))?'selected':'';?>><?php echo $value;?> - (<?php echo $key;?>)</option>
				              				<?php
				              			}
				              			?>
				              		</select>
				              	</div>
				              	<div class="col-lg-6">
				              		<label>Review Title</label>
				              		<input type="text" name="review_title" id="review_title" value="<?php echo (!empty($review_data))?$review_data->review_title:'';?>" class="form-control">
				              	</div>
			              	</div>
							<div class="card col-lg-12" style="margin-top:20px !important;">
								<div class="card-header bg-white">
				                  <h4 class="m-0 d-inline">Step 1 - Academic Details - 10th & 12th Marks, Exam Scores & Class Size</h4>
				                  <small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">
				                	<div class="row">
					                    <div class="form-group col-sm-6">
					                        <label>Select Course</label>
					                        <select class="form-control" name="review_enrollment_course" id="review_enrollment_course">
					                            <option value="0">Choose...</option>
					                            <?php
					                            foreach ($inst_courses as $key => $value) {
					                              ?>
					                              <option value="<?php echo $value['course_id'];?>" <?php echo (!empty($review_data) && ($value['course_id']==$review_data->review_course_id))?'selected':'';?>><?php echo $value['course_name'];?></option>
					                              <?php
					                            }
					                            ?>
					                        </select>
					                    </div>
					                    <div class="form-group col-sm-3">
					                        <label>Enrollment Year</label>
					                        <select class="form-control" name="review_enrollment_year" id="review_enrollment_year">
					                            <option value="0">Choose...</option>
					                            <?php
					                            foreach ($enrollment_years as $key => $value) {
					                              ?>
					                              <option value="<?php echo $value;?>" <?php echo ($value==$review_data->review_enroll_year)?'selected':'';?>><?php echo $value;?></option>
					                              <?php
					                            }
					                            ?>
					                        </select>
					                    </div>
					                    <div class="form-group col-sm-3">
				                          <label>Program Fees (Yr)</label>
				                          <input class="form-control" type="text" name="review_program_fees" id="review_program_fees" value="<?php echo (!empty($review_data))?$review_data->review_program_fees:'';?>">
				                      	</div>
				                	</div>

				                	<div class="row">
				                      <div class="form-group col-sm-3">
				                          <label>Board/University [ 12th ]</label>
				                          <select class="form-control" name="review_board_12th" id="review_board_12th">
				                            <option value="0">Choose...</option>
				                            <?php
				                            foreach ($statutory_bodies_12th as $key => $value) {
				                              ?>
				                              <option value="<?php echo $value->statutory_body_id;?>" <?php echo (!empty($review_data) && ($value->statutory_body_id==$review_data->review_12th_board_id))?'selected':'';?>><?php echo $value->statutory_body_abbr;?></option>
				                              <?php
				                            }
				                            ?>
				                          </select>
				                      </div>
				                      <div class="form-group col-sm-3">
				                          <label>Percentage Marks</label>
				                          <input class="form-control" type="text" name="review_percentage_12th_marks" id="review_percentage_12th_marks" value="<?php echo (!empty($review_data))?$review_data->review_12th_board_percentage:'';?>">
				                      </div>
				                      <div class="form-group col-sm-3">
				                          <label>Board/University [ 10th ]</label>
				                          <select class="form-control" name="review_board_10th" id="review_board_10th">
				                            <option value="0">Choose...</option>
				                            <?php
				                            foreach ($statutory_bodies_10th as $key => $value) {
				                              ?>
				                              <option value="<?php echo $value->statutory_body_id;?>" <?php echo (!empty($review_data) && ($value->statutory_body_id==$review_data->review_10th_board_id))?'selected':'';?>><?php echo $value->statutory_body_abbr;?></option>
				                              <?php
				                            }
				                            ?>
				                          </select>
				                      </div>
				                      <div class="form-group col-sm-3">
				                          <label>Percentage Marks</label>
				                          <input class="form-control" type="text" name="review_percentage_10th_marks" id="review_percentage_10th_marks"  value="<?php echo (!empty($review_data))?$review_data->review_10th_board_percentage:'';?>">
				                      </div>
				                    </div>

				                    <div class="row">
				                      

				                      <!-- <div class="form-group col-sm-6">
				                          <label>Provide JEE MAIN Scores if you had taken any exams</label>
				                          <input class="form-control" value=" ">
				                      </div>

				                      <div class="form-group col-sm-6">
				                          <label>Provide WBJEE Scores if you had taken any exams</label>
				                          <input class="form-control" value=" ">
				                      </div> -->

				                      <div class="form-group col-sm-3">
				                          <label>Have you Availed any Quota?</label>
				                          <select class="form-control" name="review_quota_available" id="review_quota_available">
				                            <option value="no" <?php echo (!empty($review_data) && $review_data->review_caste_quota_applicable=='no')?'selected':'';?>>No</option>
				                            <option value="yes" <?php echo (!empty($review_data) && $review_data->review_caste_quota_applicable=='yes')?'selected':'';?>>Yes</option>
				                          </select>
				                      </div>

				                      <div class="form-group col-sm-3">
				                          <label>Quota Type</label>
				                          <select class="form-control" name="review_quota_type" id="review_quota_type">
				                            <?php
				                            foreach ($caste_quota as $key => $value) {
				                              ?>
				                              <option value="<?php echo $value->quota_id;?>" <?php echo ($value->quota_id==$review_data->review_caste_quota_id)?'selected':'';?>><?php echo $value->quota_name;?></option>
				                              <?php
				                            }
				                            ?>
				                          </select>
				                      </div>

				                      
				                    </div>

				                    <div class="row">

				                      	<div class="form-group col-sm-3">
				                          <label>Was there any GD/PI for the admission</label>
				                          <select class="form-control" name="review_gd_pi_available" id="review_gd_pi_available">
				                            <option value="no" <?php echo (!empty($review_data) && $review_data->review_gd_pi_applicable=='no')?'selected':'';?>>No</option>
				                            <option value="yes" <?php echo (!empty($review_data) && $review_data->review_gd_pi_applicable=='yes')?'selected':'';?>>Yes</option>
				                          </select>
				                      	</div>

					                    <div class="form-group col-sm-3">
					                        <label>What was your class size?</label>
					                        <input type="text" class="form-control" name="review_class_size" value="<?php echo (!empty($review_data))?$review_data->review_class_size:'';?>">
					                    </div>                       
				                      

					                    <div class="form-group col-sm-3">
					                        <label class="d-block">Did you opt for hostels?</label>
					                        <select class="form-control" name="review_opt_for_hostels" id="review_opt_for_hostels">
					                            <option value="no" <?php echo (!empty($review_data) && $review_datareview_opt_hostel=='no')?'selected':'';?>>No</option>
					                            <option value="yes" <?php echo (!empty($review_data) && $review_datareview_opt_hostel=='yes')?'selected':'';?>>Yes</option>
					                        </select>
					                    </div>

					                    <div class="form-group col-sm-3">
					                        <label>Hostel Fees(Yr)</label>
					                        <input class="form-control" type="text" <?php echo ($review_data->review_opt_hostel=='no')?'disabled="true"':''?> name="review_hostel_fees" id="review_hostel_fees" value="<?php echo (!empty($review_data))?$review_data->review_opt_hostel_fees:'';?>" disabled="disabled">
					                    </div>
				                    </div>

				                    <div class="row">
				                      <div class="form-group col-sm-3">
				                          <label class="d-block">Does your college provide placements?</label>
				                          <select class="form-control" name="review_placement_provided" id="review_placement_provided">
				                            <option value="no" <?php echo (!empty($review_data) && $review_data->review_inst_placement_applicable=='no')?'selected':'';?>>No</option>
				                            <option value="yes" <?php echo (!empty($review_data) && $review_data->review_inst_placement_applicable=='yes')?'selected':'';?>>Yes</option>
				                          </select>
				                      </div>
				                      <div class="form-group col-sm-4">
				                          <label class="d-block">Does your college provide internship opportunities?</label>
				                          <select class="form-control" name="review_internship_provided" id="review_internship_provided">
				                            <option value="no" <?php echo (!empty($review_data) && $review_data->review_inst_internship_applicable=='no')?'selected':'';?>>No</option>
				                            <option value="yes" <?php echo (!empty($review_data) && $review_data->review_inst_internship_applicable=='yes')?'selected':'';?>>Yes</option>
				                          </select>
				                      </div>
				                    </div>


				                    <div class="row">
				                    	<div class="form-group col-lg-12">
				                    		<label class="d-block">College Overview</label>
				                    		<textarea class="form-control" rows="15" id="review_college_overview" name="review_college_overview"></textarea>
				                    	</div>
				                    </div>

				                </div>

				                <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="btn_save_step_1">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Admission Process & Exams info 1-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_2" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_2">
					        <input type="hidden" name="review_step" id="review_step" value="step_3">
					        <input type="hidden" name="review_q_type" value="1">
					        <input type="hidden" name="review_question" value="How was admission process? Describe the below pointers">
					        <input type="hidden" name="review_q_type_title" value="Admission Process & Exams Overview">
					        <input type="hidden" name="review_q_category" value="Admission">
					        <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 2 - Admission Process & Exams info</h4>
	          						<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q1. How was admission process? Describe the below pointers?If you took any entrance exam, discuss application process and cut off</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>Eligibility of the Course</li>
											<li>Details of Reservation Benefits (if availed)</li>
											<li>Any improvement you want to see in the admission process</li>
											<li>Mention the colleges you applied and reason of not attending</li>
											<li>If you availed any quota for admission, provide details</li>
											<li>Discuss the admission criteria for your program, such as minimum marks and age</li>
											<li>How was the admission process, provide details of the counselling day (if there was any)</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_admission_data))?$review_admission_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>" <?php echo (!empty($review_admission_data) && $review_admission_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_2_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Course Curriculum Overview 2-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_3" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_3">
						    <input type="hidden" name="review_step" id="review_step" value="step_4">
						    <input type="hidden" name="review_q_type" value="2">
						    <input type="hidden" name="review_question" value="How is the course curriculam & faculty members?">
						    <input type="hidden" name="review_q_type_title" value="Course Curriculum Overview">
						    <input type="hidden" name="review_q_category" value="Academic">
						    <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 3 - Course Curriculam & Academic Overview</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q2. How is the course curriculam & faculty members?</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>Mention why did you choose the course</li>
											<li>A brief about faculty student ratio</li>
											<li>Qualification of the faculty & review teaching method</li>
											<li>How timely was term exams and how diffidult was pass</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_academics_data))?$review_academics_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>" <?php echo (!empty($review_academics_data) && $review_academics_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_3_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Loan/ Scholarship Provisions 3-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_4" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_4">
					      	<input type="hidden" name="review_step" id="review_step" value="step_5">
					      	<input type="hidden" name="review_q_type" value="3">
					      	<input type="hidden" name="review_question" value="How is the fees structure & discuss the oppourtunity of the scholarship,financial assistance or campus jobs?">
					      	<input type="hidden" name="review_q_type_title" value="Loan/ Scholarship Provisions">
					      	<input type="hidden" name="review_q_category" value="Scholarship">
					      	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 4 - Fees Structure & Scholarship Overview</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>

				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q3. How is the fees structure & discuss the oppourtunity of the scholarship,financial assistance or campus jobs?</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>Discuss the fees hike policy and cost to study</li>
											<li>Name of Scholarship,Financial Assistance & Job you got on campus with stipend</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_scholarship_data))?$review_scholarship_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>" <?php echo (!empty($review_scholarship_data) && $review_scholarship_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_4_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Campus Life 4-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_5" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_5">
					        <input type="hidden" name="review_step" id="review_step" value="step_6">
					        <input type="hidden" name="review_q_type" value="4">
					        <input type="hidden" name="review_question" value="How is the Hostel Facility or provide details of your rented accomodation?">
					        <input type="hidden" name="review_q_type_title" value="Campus Life">
					        <input type="hidden" name="review_q_category" value="Campus Life">
					        <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 5 - Campus & Social Life Overview</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>

				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q5. How is life at campus?Discuss about social Life,Clubs & Infrastructre</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>Name the annual fest & tech fest and month in which they are conducted</li>
											<li>Availability of books & journals in the library</li>
											<li>Amenities in classrooms</li>
											<li>Brief of course & extra curricular activities on the campus</li>
											<li>Mention any social group,clubs or websites for students</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_campus_life_data))?$review_campus_life_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>" <?php echo (!empty($review_campus_life_data) && $review_campus_life_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_5_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Hostel Facilities 5-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_6" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_6">
					        <input type="hidden" name="review_step" id="review_step" value="step_7">
					        <input type="hidden" name="review_q_type" value="5">
					        <input type="hidden" name="review_question" value="How is the Hostel Facility or provide details of your rented accomodation?">
					        <input type="hidden" name="review_q_type_title" value="Hostel Facilities">
					        <input type="hidden" name="review_q_category" value="Accomodation">
					        <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 6 - Hostel Facility or Accomodation Info</h4>
	              					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>

				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q6. How is the Hostel Facility or provide details of your rented accomodation?</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>Provide details of the facilities provided oin the room</li>
											<li>Review of meal quality & menu</li>
											<li>Registration process for Hostel & Affordability</li>
											<li>Brief of course & extra curricular activities on the campus</li>
											<li>Mention the locality if you rented a room or PG</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_accomodation_data))?$review_accomodation_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>"  <?php echo (!empty($review_accomodation_data) && $review_accomodation_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_6_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Placement Experience 6-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_7" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_7">
						    <input type="hidden" name="review_step" id="review_step" value="step_8">
						    <input type="hidden" name="review_q_type" value="6">
						    <input type="hidden" name="review_question" value="How are the Placements of Your College?If No Campus Placement is offered discuss about employability or plans after completeing the course.">
						    <input type="hidden" name="review_q_type_title" value="Placement Experience">
						    <input type="hidden" name="review_q_category" value="Placement">
						    <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 7 - Campus Placement Info</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>

				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q7. How are the Placements of Your College?If No Campus Placement is offered discuss about employability or plans after completeing the course.</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>From Which semester students became eligible for the campus placements</li>
											<li>Name of the Companies Visited & no of offers made</li>
											<li>Provide details of the highest and avereage package as per company and profile offered</li>
											<li>Percentage of students getting placements</li>
											<li>Your plans after getting the degree</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_placement_data))?$review_placement_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>" <?php echo (!empty($review_placement_data) && $review_placement_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_7_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Internships Opportunities 7-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_8" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_8">
					      	<input type="hidden" name="review_step" id="review_step" value="step_9">
					      	<input type="hidden" name="review_q_type" value="7">
					      	<input type="hidden" name="review_question" value="Provide details of Internship oppourtunities available with your college">
					      	<input type="hidden" name="review_q_type_title" value="Internships Opportunities">
					      	<input type="hidden" name="review_q_category" value="Internships">
					      	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 8 - Internship Reviews & ratings</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q8. Provide details of Internship oppourtunities available with your college</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>Mention projects and the outcomes to clarify the tasks</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_internship_data))?$review_internship_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>" <?php echo (!empty($review_internship_data) && $review_internship_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_8_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>


					<!--Interview Experience 8-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_9" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_9">
					      	<input type="hidden" name="review_step" id="review_step" value="step_10">
					      	<input type="hidden" name="review_q_type" value="8">
					      	<input type="hidden" name="review_question" value="Provide details of Internship oppourtunities available with your college">
					      	<input type="hidden" name="review_q_type_title" value="Interview Experience">
					      	<input type="hidden" name="review_q_category" value="Interview">
					      	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 9 - Interview Experience</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q8. Provide details of Internship oppourtunities available with your college</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>Mention projects and the outcomes to clarify the tasks</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_interview_data))?$review_interview_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>" <?php echo (!empty($review_interview_data) && $review_interview_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_9_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Faculty Overview 9-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_10" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_10">
						    <input type="hidden" name="review_step" id="review_step" value="step_11">
						    <input type="hidden" name="review_q_type" value="9">
						    <input type="hidden" name="review_question" value="How is the course curriculam & faculty members?">
						    <input type="hidden" name="review_q_type_title" value="Faculty Overview">
						    <input type="hidden" name="review_q_category" value="Faculty">
						    <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 10 - Faculty Overview</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                  	<p><h5>Q2. How is the course curriculam & faculty members?</h5></p>
					                  	<p>What to include?</p>
					                    <ol>
											<li>Mention why did you choose the course</li>
											<li>A brief about faculty student ratio</li>
											<li>Qualification of the faculty & review teaching method</li>
											<li>How timely was term exams and how diffidult was pass</li>
										</ol>

					                </div>
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_faculty_data))?$review_faculty_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div> 
					              <div class="row">
					                <div class="col-lg-12">
					                  <label>Rating</label>
					                  <select class="form-control" name="review_rating" id="review_rating">
					                  	<?php
					                  	for ($i=1; $i <=10 ; $i++) { 
					                  		?>
					                  		<option value="<?php echo $i;?>" <?php echo (!empty($review_faculty_data) && $review_faculty_data->review_question_rating==$i)?'selected':'';?>><?php echo $i;?></option>
					                  		<?php
					                  	}
					                  	?>
					                  </select>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_10_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Remarks 10-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_11" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_11">
					      	<input type="hidden" name="review_step" id="review_step" value="step_12">
					      	<input type="hidden" name="review_q_type" value="10">
					      	<input type="hidden" name="review_q_type_title" value="Remarks">
					      	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 11 - Remarks</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_remarks_data))?$review_remarks_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_11_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Likes 11-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_12" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_12">
					      	<input type="hidden" name="review_step" id="review_step" value="step_13">
					      	<input type="hidden" name="review_q_type" value="11">
					      	<input type="hidden" name="review_q_type_title" value="Likes">
					      	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 12 - Likes</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_likes_data))?$review_likes_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_12_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Dis Likes 12-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_step_13" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
							<input type="hidden" name="review_step_data" id="review_step_data" value="step_13">
					      	<input type="hidden" name="review_step" id="review_step" value="step_14">
					      	<input type="hidden" name="review_q_type" value="12">
					      	<input type="hidden" name="review_q_type_title" value="Dislikes">
					      	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Step 13 - Dislikes</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_opt" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_dislikes_data))?$review_dislikes_data->review_question_answer:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="form_review_step_13_btn">Submit</button>
				                		</div>
				                	</div>
				                </div>
							</div>
						</form>
					</div>

					<!--Comments-->
					<div class="row" style="margin-top:20px !important;">
						<form id="form_review_comment" style="width:100% !important;">
							<input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_id;?>">
					      	<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
					      	<input type="hidden" name="review_status_change" value="yes">
							<div class="card col-lg-12">
								<div class="card-header bg-white">
				                  	<h4 class="m-0 d-inline">Comment</h4>
	            					<small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
				                </div>
				                <div class="card-body">                  
					              <div class="row">
					                <div class="form-group col-sm-12">
					                	<textarea id="review_opt" name="review_comment" placeholder="Type your info" spellcheck="false" rows="10" maxlength="1000" minlength="200" class="pl-5 form-control q-area border-red"><?php echo (!empty($review_data->review_status_comment))?$review_data->review_status_comment:'';?></textarea>
	                      				<div class="d-flex justify-content-between mt-1 text-sm"><div class="">Min. Character: 200</div><div class=""><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
					                </div>
					              </div>
					              <div class="row">
					              	<div class="form-group col-sm-12">
					              		<label class="control-label">Review Status</label>
					              		<select class="form-control" name="review_status">
					              			<option value="incomplete_and_not_approved" <?php echo (!empty($review_status_data) && ($review_status_data->review_approved=='incomplete_and_not_approved'))?'selected':'';?>>Incomplete & Not Approved</option>
					              			<option value="complete_and_not_approved" <?php echo (!empty($review_status_data) && ($review_status_data->review_approved=='complete_and_not_approved'))?'selected':'';?>>Complete & Not Approved</option>
					              			<option value="complete_and_not_moderated" <?php echo (!empty($review_status_data) && ($review_status_data->review_approved=='complete_and_not_moderated'))?'selected':'';?>>Complete & Not Moderated</option>
					              			<option value="incomplete" <?php echo (!empty($review_status_data) && ($review_status_data->review_approved=='incomplete'))?'selected':'';?>>Incomplete</option>
					              			<option value="not_approved" <?php echo (!empty($review_status_data) && ($review_status_data->review_approved=='not_approved'))?'selected':'';?>>Not Approved</option>
					              			<option value="approved" <?php echo (!empty($review_status_data) && ($review_status_data->review_approved=='approved'))?'selected':'';?>>Approved</option>
					              			<option value="rejected" <?php echo (!empty($review_status_data) && ($review_status_data->review_approved=='rejected'))?'selected':'';?>>Rejected</option>
					              		</select>
					              	</div>
					              </div>                 
					            </div>
					            <div class="card-footer">
				                	<div class="row">
				                		<div class="col-md-12">
				                			<button type="submit" class="btn btn-success" id="btn_update_review_status">Submit</button>
				                		</div>
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


<script type="text/javascript">
	var parent_folder='';
</script>