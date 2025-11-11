ac<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page"><a href="<?php echo $course_link;?>" target="_blank"><?php echo $course_data->course_name;?> Menues List</a></li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Course Menu Data </h6>
					<form class="forms-sample" id="form_course_data_edit" autocomplete="off" method="post">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
						<input type="hidden" name="course_id" value="<?php echo encode_data($course_data->course_id);?>">
						<input type="hidden" name="menu_id" value="<?php echo $course_menues['menu_id'];?>">
						<div class="form-group row">
							<div class="col-md-12">
								<label for="system_meta_title">Course Menu Name</label>
								<input type="text" class="form-control" id="course_menu_name" name="course_menu_name" autocomplete="off" placeholder="Menu Name Name" value="<?php echo $course_menues['menu_name'];?>">
							</div>
						</div>
						<?php $table_row=0;?>
						

						<div id="heading_rows" class="row table-responsive">
							<table class="table">
								<tbody>
									<?php
									if(!empty($course_general_details_data)){
										

										//unset($course_general_details_data[0]);
										
										foreach ($course_general_details_data as $key => $value) {



											if($value->course_data_type=='image'){
												?>
												<tr id="tr3<?php echo $table_row;?>">
													<td>
														<div class="form-group row">
															<div class="col-md-12">
																<label>Image Data</label>
																<input type="hidden" name="course_overview_general_heading_details[<?php echo $table_row;?>][data_type]" value="image">
																<input type="hidden" name="course_overview_general_heading_details[<?php echo $table_row;?>][data_type_value]" value="<?php echo encode_data($value->course_data_image_id);?>">
																<input type="hidden" name="course_overview_general_heading_details[<?php echo $table_row;?>][heading_detail]" value="<?php echo $value->course_data_value;?>">
																<div class="row"><img src="<?php echo $value->course_data_value;?>" class="img-thumbnail" alt="Cinque Terre"></div>';
															<div>
														</div>
														<div class="form-group row">
															<div class="col-md-12">
																<?php echo $value->course_data_type;?>
																<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull0right" onclick="$('#tr3<?php echo $table_row;?>').remove()">Delete Row</button>
															</div>
														</div>
													</td>
												<tr>
												<?php
											}else{
												?>
												<tr id="tr3<?php echo $table_row;?>">
													<td>
														<div class="form-group row">
															<div class="col-md-12">
																<label for="system_meta_title"><?php echo ucwords($value->course_data_type);?> Course Details</label>
																<input type="hidden" name="course_overview_general_heading_details[<?php echo $table_row;?>][data_type]" value="general">
																<textarea class="form-control course_overview_general" rows="40" name="course_overview_general_heading_details[<?php echo $table_row;?>][heading_detail]"><?php echo $value->course_data_value;?></textarea>
															</div>
														</div>
														<div class="form-group row"><div class="col-md-12"><?php echo $value->course_data_type;?><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull0right" onclick="$('#tr3<?php echo $table_row;?>').remove()">Delete Row</button></div></div>
													</td>
												</tr>
												<?php	
											}
											
											$table_row++;
										}
									}else{

										?>
										<tr id="tr3<?php echo $table_row;?>">
											<td>
												<div class="form-group row">
													<div class="col-md-12">
														<label for="system_meta_title"><strong>Course Details</strong></label>
														<input type="hidden" name="course_overview_general_heading_details[<?php echo $table_row;?>][data_type]" value="general">
														<textarea class="form-control course_overview_general" name="course_overview_general_heading_details[<?php echo $table_row;?>][heading_detail]" rows="40"><?php echo (!empty($course_general_details_data))?$course_general_details_data[0]->course_data_value:'';?></textarea>
													</div>
												</div>
											</td>
										</tr>
										<?php

										$table_row=$table_row+1;
									}

									?>

									<script type="text/javascript">var hdr='<?php echo $table_row;?>';</script> 
								</tbody>
							</table>								
						</div>

						<div id="heading_faqs_rows" class="row table-responsive">
							<h6>Course FAQs</h6>
							<?php $course_faq_row=0;?>
							<hr>
							<table class="table" id="heading_faqs_rows_table">
								<thead>
									<th>Question</th>
									<th>Answer</th>
									
								</thead>
								<tbody>

									<?php

									if(!empty($course_faq_details_data)){

										foreach ($course_faq_details_data as $key => $value) {
											?>
											<tr id="trCourseDetails<?php echo $course_faq_row;?>">
												<td>
													<input type="hidden" name="course_faqs[<?php echo $course_faq_row;?>][data_type]" value="faqs">
				        							<textarea class="form-control" name="course_faqs[<?php echo $course_faq_row;?>][ques]" aria-describedby="stream_faqus" placeholder="Question" rows="5"><?php echo $value->course_data_heading;?></textarea>
				        						</td>
				        						<td>
				        							<textarea class="form-control course_overview_general" name="course_faqs[<?php echo $course_faq_row;?>][ans]" aria-describedby="stream_faqus" placeholder="Answer" rows="5"><?php echo $value->course_data_value;?></textarea>
				        							<hr>
				        							<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trCourseDetails<?php echo $course_faq_row;?>').remove()" style="float:right;">Delete Row</button>
				        						</td>
											</tr>
											<?php

											$course_faq_row++;
										}

									}else{
										?>
										<tr>
											<td>
												<input type="hidden" name="course_faqs[<?php echo $course_faq_row;?>][data_type]" value="faqs">
			        							<textarea class="form-control" name="course_faqs[<?php echo $course_faq_row;?>][ques]" aria-describedby="stream_faqus" placeholder="Question" rows="5"></textarea>
			        						</td>
			        						<td>
			        							<textarea class="form-control course_overview_general" name="course_faqs[<?php echo $course_faq_row;?>][ans]" aria-describedby="stream_faqus" placeholder="Answer" rows="5"></textarea>
			        							<hr>
			        							<button type="button" class="btn btn-xs btn-primary" id="btn_add_faqs" style="float: right;"><i class="fa fa-plus"></i></button>
			        						</td>
										</tr>
										<?php
									}

									?>

										
								</tbody>
							</table>
							<script type="text/javascript">var course_faq_row='<?php echo ($course_faq_row==0)?($course_faq_row+1):$course_faq_row;?>';</script>								
						</div>


						



						<div class="buy-now-wrapper" id="buttons_wrapper">
							<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_add_heading">Add Heading</button>
							<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#fileUploadModal">Upload Files</button>
							<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#tinyFileBrowserModal">Add Image</button>
							<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0" id="btn_add_youtube_video">Add Youtube Video</button>
							<button type="button" class="btn btn-dark btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#adsModal">Import Google Ads</button>
							<button type="button" class="btn btn-dark btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#adsModal">Import Ads</button>
							<button type="submit" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_save_course_details_data">Save Data</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

</div>




<style type="text/css">
	.table td img {
	    width: 30% !important;
	    height: 346px !important;
	    border-radius: 0% !important; 
	}
</style>

<script type="text/javascript">
	var course_parent='';
	var course_id='<?php echo encode_data($course_data->course_id);?>';
	var _parent_stream='';
	var stream='';
	var degree='';
	var parent_folder='<?php echo $parent_folder_data[0]->media_disk_name;?>';
	var p_row='';

	var exams_links=<?php echo (!empty($exams_links))?$exams_links:'[]';?>;
	var exam_menues='';
	var colleges_links='<?php echo (!empty($college_links))?$college_links:'[]';?>';
	var courses_links=<?php echo (!empty($courses_links))?$courses_links:'[]';?>;

	var course_page_question_paper='<?php echo $course_page_question_paper;?>';
	var course_page_answer_paper='<?php echo $course_page_answer_paper;?>';
	var course_page_speaking_test_paper='<?php echo $course_page_speaking_test_paper;?>';
	var course_page_writing_practice_paper='<?php echo $course_page_writing_practice_paper;?>';
	var course_page_listening_practice_paper='<?php echo $course_page_listening_practice_paper;?>';
	var course_page_sample_practice_paper='<?php echo $course_page_sample_practice_paper;?>';
	var course_page_syllabus_pdfs='<?php echo $course_page_syllabus_pdfs;?>';
	var course_page_cutoff_pdfs='<?php echo $course_page_cutoff_pdfs;?>';
</script>