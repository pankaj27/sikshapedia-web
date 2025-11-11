<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Create Blog Posts</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Blog Post</h6>
					<div class="col-md-12">
						<form id="form_blog_posts_add_edit" method="post" enctype="multipart/form-data">
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<input type="hidden" name="_blog_post" id="_blog_post" class="form-control" value="<?php echo $blog_id;?>">
							<div class="row">
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Post Main Category</label>
										<select class="form-control" name="blog_post_category" id="blog_post_category">
											<option value="0">Select category</option>
											<?php
											if(!empty($blog_categories)){
												foreach ($blog_categories as $key => $value) {
													?>
													<option value="<?php echo $value['category_id'];?>"  <?php echo $value['selected'];?>><?php echo $value['category_name'];?></option>
													<?php
												}
											}
											?>									
										</select>
									</div>
								</div>

								<div class="col-sm-3" id="custom_category_div" style="display:none;">
									<div class="form-group">
										<label class="control-label">Custom Category</label>
										<input type="text" name="blog_custom_category" id="blog_custom_category" class="form-control" value="" placeholder="Add Custom Category">
									</div>
								</div>

								<div class="col-sm-6">
									<div class="form-group">
										<label class="control-label">Post name</label>
										<input type="text" name="blog_post_name" id="blog_post_name" class="form-control" placeholder="Add Post name" value="<?php echo (!empty($blog_post_data))?$blog_post_data->post_name:'';?>">
									</div>
								</div>

								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Status</label>
										<select class="form-control" name="blog_post_status" id="blog_post_status">
											<?php
											foreach ($blog_status as $key => $value) {
												?>
												<option value="<?php echo $value['status_value'];?>" <?php echo $value['selected'];?>><?php echo $value['status_name'];?></option>
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
										<label class="control-label">Post Connect to Other Category</label>
										<select class="form-control" name="blog_post_other_category[]" id="blog_post_other_category" multiple>
											<option value="0">Select category</option>
											<?php
											if(!empty($blog_o_categories)){
												foreach ($blog_o_categories as $key => $value) {
													?>
													<option value="<?php echo $value['category_id'];?>"  <?php echo $value['selected'];?>><?php echo $value['category_name'];?></option>
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
										<label class="control-label" class="label_title">Post Title</label>
										<input type="text" name="blog_post_title" id="blog_post_title" class="form-control" placeholder="Add Title" value="<?php echo (!empty($blog_post_data))?$blog_post_data->post_title:'';?>">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label" class="label_title">Post Sub-Title</label>
										<input type="text" name="blog_post_sub_title" id="blog_post_sub_title" class="form-control" placeholder="Add Sub Title" value="<?php echo (!empty($blog_post_data))?$blog_post_data->post_subtitle:'';?>">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-6">
									<div class="form-group">
										<label class="control-label" class="label_title">Post Meta Title</label>
										<textarea class="form-control" rows="5" name="blog_post_meta_title" id="blog_post_meta_title"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_meta_title:'';?></textarea>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label class="control-label" class="label_title">Post Meta Keywords</label>
										<textarea class="form-control" rows="5" name="blog_post_meta_keywords" id="blog_post_meta_keywords"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_meta_key_words:'';?></textarea>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="form-group">
										<label class="control-label" class="label_title">Post Meta Desc</label>
										<textarea class="form-control" rows="5" name="blog_post_meta_desc" id="blog_post_meta_desc"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_meta_desc:'';?></textarea>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-6">
									<div class="form-group">
										<label class="control-label" class="label_title">Post Meta OG Title</label>
										<textarea class="form-control" rows="5" name="blog_post_meta_og_title" id="blog_post_meta_og_title"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_og_title:'';?></textarea>
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label class="control-label" class="label_title">Post Meta OG Desc</label>
										<textarea class="form-control" rows="5" name="blog_post_mete_og_desc" id="blog_post_mete_og_desc"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_og_desc:'';?></textarea>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-3">
									<div class="form-group">
										<label class="control-label">Add to Search</label>
										<select class="form-control" name="blog_to_search" id="blog_to_search">
											<option value="yes">Yes</option>
											<option value="no">No</option>
										</select>
									</div>
								</div>

							</div>

							<?php
							if(empty($blog_post_data)){
								?>
								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_cover_media" data-toggle="modal" data-target="#specificFileBrowserModal">Add Post Cover Image</button>
										</div>
									</div>
								</div>
								<?php
							}

							?>

							
							<div class="row" id="row_cover_media">
								<?php
								if(!empty($blog_post_data)){
									?>
									<div class="form-group row">
								    	<div class="col-md-12">
									    	<input type="hidden" id="blog_post_cover_image" name="blog_post_cover_image" value="<?php echo $blog_post_data->post_cover_image;?>">
									    	<div class="row">
									    		<img id="data_coberimg_src" src="<?php echo $blog_post_data->post_cover_image;?>" class="img-thumbnail" alt="Cinque Terre">
									    	</div>
									    </div>
								    
								    	<div class="form-group row">
								    		<div class="col-md-12">
								    			<button type="button" id="btn_update_cover_media" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button>
								    		</div>
								    	</div>
								    </div>
									<?php
								}

								?>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="row table-responsive" id="blog_heading_rows">
										<table class="table" style="width:100% !important;">
											<?php $table_row='0';?>
											<?php
											if(!empty($blog_contents_data)){
												foreach ($blog_contents_data as $key => $value) {
													if($value->content_type=='general'){
														?>
														<tr id="trBlogPost<?php echo $table_row;?>">
															<td>
																<div class="form-group row">
																	<div class="col-md-12">
														            	<label for="blog_post_details" class="label_title">Content Detail</label>
														            	<input type="hidden" name="blog_post_details[<?php echo $table_row;?>][data_type]" value="general">
														            	<input type="number" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->content_serial;?>">
														            	<textarea class="form-control blog_post_details" rows="40" name="blog_post_details[<?php echo $table_row;?>][post_content]"><?php echo $value->content_value;?></textarea>
														          	</div>
														        </div>
															</td>
														</tr>
														<?php
													}else if($value->content_type=='image'){
														?>
														<tr id="trBlogPost<?php echo $table_row;?>">
														    <td>
														    	<div class="form-group row">
														    		<div class="col-md-12">
														    			<h6>Image Data</h6>
														    			<input type="hidden" id="blog_post_details_data_type<?php echo $table_row;?>" name="blog_post_details[<?php echo $table_row;?>][data_type]" value="<?php echo $value->content_type;?>">
														    			<input type="hidden" id="blog_post_details_data_type_value<?php echo $table_row;?>" name="blog_post_details[<?php echo $table_row;?>][data_type_value]" value="<?php echo $value->content_type_id;?>">
														    			<input type="hidden" id="blog_post_details_post_content<?php echo $table_row;?>" name="blog_post_details[<?php echo $table_row;?>][post_content]" value="<?php echo $value->content_value;?>">
														    			<input type="number" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->content_serial;?>">
														    			<div class="row"><img id="data_img_src<?php echo $table_row;?>" src="<?php echo $value->content_value;?>" class="img-thumbnail" alt="Cinque Terre"></div>
														    		</div>
														    		<div class="form-group row">
														    			<div class="col-md-12">
														    				<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="<?php echo $table_row;?>" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button>
														    				<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trBlogPost<?php echo $table_row;?>').remove()">Delete Row</button>
														    			</div>
														    		</div>
														    	</div>
														    </td>
													    <tr>
														<?php
													}else if($value->content_type=='ads'){
														?>
														<tr id="trBlogPost<?php echo $table_row;?>">
													      	<td>
													      	<div class="form-group row">
													        	<div class="col-md-12">
													                <h6><strong>Ads</strong></h6>
													                <input type="hidden" name="blog_post_details[<?php echo $table_row;?>][data_type]" value="ads">';
													                <input type="number" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->content_serial;?>">
													                <input type="hidden" id="blog_post_details_data_type_value<?php echo $table_row;?>" name="blog_post_details[<?php echo $table_row;?>][data_type_value]" value="<?php echo $value->content_type_id;?>">
													                <textarea class="form-control" rows="40" name="blog_post_details[<?php echo $table_row;?>][post_content]" style="display:none;"><?php echo $value->content_value;?></textarea>
													                <div class="col-md-12"><?php echo $value->content_value;?></div>
													             </div>
													        </div>
													      	<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trBlogPost<?php echo $table_row;?>').remove()">Delete Row</button></div></div>
													      	</td>
													    </tr>
														<?php
													}else if($value->content_type=='youtube'){

													}
													?>
													
													<?php

													$table_row++;
												}
											}else{
												?>
												<tr id="trBlogPost<?php echo $table_row;?>">
													<td>
														<div class="form-group row">
															<div class="col-md-12">
												            	<label for="blog_post_details" class="label_title">Content Detail</label>
												            	<input type="hidden" name="blog_post_details[<?php echo $table_row;?>][data_type]" value="general">
												            	<input type="number" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_serial]" value="0">
												            	<textarea class="form-control blog_post_details" rows="40" name="blog_post_details[<?php echo $table_row;?>][post_content]"></textarea>
												          	</div>
												        </div>
													</td>
												</tr>
												<?php
											}

											?>

											
										</table>

										<script type="text/javascript">var bposthdr='<?php echo ($table_row==0)?($table_row+1):$table_row;?>';</script>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12"><h5>Faq's</h5></div>
	        					<div class="col-sm-12">
	        						<table class="table" id="form_blog_faqus_table">
			        					<thead>
			        						<tr>
			        							<th>Question/Answer</th>
			        							<th></th>
			        						</tr>
			        					</thead>
			        					<tbody>
				        					<?php
				        					$exf=0;

				        					if(!empty($get_blog_faqs_data)){
				        						foreach ($get_blog_faqs_data as $key => $value) {
				        							?>
				        							<tr id="#trBlogfaqsDetails<?php echo $exf;?>">
					        							<td>
					        								<div class="row">
					        									<input type="hidden" name="blog_faqus[<?php echo $exf;?>][data_type]" value="blog_faqs">
						        								<input type="text" class="form-control" name="blog_faqus[<?php echo $exf;?>][ques]" aria-describedby="blog_faqus" placeholder="Question" value="<?php echo $value->content_value;?>">
						        							</div>

						        							<div class="row">
						        								<textarea class="form-control blog_post_details" name="blog_faqus[<?php echo $exf;?>][ans]" placeholder="Answer" rows="5" style="width:100%;"><?php echo $value->content_value_ans;?></textarea>
						        							</div>
						        						</td>

						        						<td><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trBlogfaqsDetails<?php echo $exf;?>').remove()"><i class="fa fa-trash"></i></button><button type="button" class="btn btn-xs btn-primary" id="btn_add_blog_faqus_row"><i class="fa fa-plus"></i></button></td>
						        					</tr>
				        							<?php
				        							$exf++;
				        						}
				        					}else{
				        						?>
				        						<tr id="#trBlogfaqsDetails<?php echo $exf;?>">
				        							<td>
				        								<div class="row">
				        									<input type="hidden" name="blog_faqus[<?php echo $exf;?>][data_type]" value="blog_faqs">
					        								<input type="text" class="form-control" name="blog_faqus[<?php echo $exf;?>][ques]" aria-describedby="blog_faqus" placeholder="Question" value="">
					        							</div>

					        							<div class="row">
					        								<textarea class="form-control blog_post_details" name="blog_faqus[<?php echo $exf;?>][ans]" placeholder="Answer" rows="5" style="width:100%;"></textarea>
					        							</div>
					        						</td>

					        						<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_blog_faqus_row"><i class="fa fa-plus"></i></button></td>
					        					</tr>
				        						<?php
				        					}


				        					?>
				        					     							
		        											
			        					</tbody>
			        				</table>

			        				<script type="text/javascript">var blog_faqus_row='<?php echo $exf;?>';</script>
	        					</div>
	        				</div>

							<div class="row">
								<div class="buy-now-wrapper" id="buttons_wrapper">
									<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_add_heading">Add Content</button>
									<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#specificFileBrowserModal" id="btn_add_media">Add Media</button>
									<button type="button" class="btn btn-dark btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#adsModal">Import Ads</button>
									<button type="submit" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_save_blog">Save Data</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

</div>


<style type="text/css">

	.label_title{
		font-weight: bold;

	}
	.select2-container{
		width: 100% !important;
	}

	#news_category_type_value_chosen{
		width: 100% !important;
	}

	.table td img {
	    width: 30% !important;
	    height: 346px !important;
	    border-radius: 0% !important; 
	}

	.tox .tox-tinymce{
		width: 100% !important;
	}
</style>

<script type="text/javascript">var parent_folder='<?php echo $parent_folder_data->media_disk_name;?>';var news_type='';var news_types_id='<?php echo (isset($news_type_id))?$news_type_id:'';?>';var p_row='';var exam_menues ='';var exam_news='';var exam_page_question_paper='';var exam_page_answer_paper='';var xam_page_speaking_test_paper='';var exam_page_speaking_test_paper='';var exam_page_writing_practice_paper='';var exam_page_listening_practice_paper ='';var exam_page_sample_practice_paper='';

	var parent_folder='<?php echo $parent_folder_data->media_disk_name;?>';

	var colleges_links=<?php echo (!empty($college_links))?$college_links:"[]";?>;
	var university_links='';
	var exams_links=<?php echo (!empty($exams_links))?$exams_links:"[]";?>;
	var courses_links=<?php echo (!empty($courses_links))?$courses_links:"[]";?>;
	var blog_links=<?php echo (!empty($blogs_links))?$blogs_links:"[]";?>;
	var p_row='';

</script>