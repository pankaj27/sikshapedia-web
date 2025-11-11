<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Create Blog Posts</li>
		</ol>
	</nav>

	<form id="form_blog_posts_add_edit_new" method="post" enctype="multipart/form-data">
		<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
		<input type="hidden" name="_blog_post" id="_blog_post" class="form-control" value="<?php echo $blog_id;?>">
		<div class="row">
			
			<div class="col-md-8 grid-margin stretch-card">
				<div class="card">
					<div class="card-body">
						<h6 class="card-title">Blog Post</h6>
						<div class="col-md-12">
								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label">Post name</label>
											<input type="text" name="blog_post_name" id="blog_post_name" class="form-control" placeholder="Add Post name" value="<?php echo (!empty($blog_post_data))?$blog_post_data->post_name:'';?>">
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-sm-12">
										<div class="form-group">
											<label class="control-label" class="label_title">Post Title</label>
											<textarea type="text" name="blog_post_title" id="blog_post_title" class="form-control" placeholder="Add Title" rows="5"><?php echo (!empty($blog_post_data))?$blog_post_data->post_title:'';?></textarea>
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
									<div class="col-sm-12">
										<div class="row table-responsive" id="blog_heading_rows">
											<?php $table_row=1;?>
											<table class="table" style="width:100% !important;">
												<tbody>
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
																            	<div class="input-group mb-3">
																	            	<input type="number" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->content_serial;?>">
																	            	<div class="input-group-append">
																			            <span class="input-group-text" id="basic-addon2">Content Serial no.</span>
																			        </div>
																	            </div>
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
																		<div class="form-group row" style="border: 2px solid #e0f6f6;border-radius: 10px;padding: 20px;margin-bottom: 20px;">
																			<div class="col-md-4">
																			    <h6>Image Data</h6>
																			    <input type="hidden" id="blog_post_details_data_type<?php echo $table_row;?>" name="blog_post_details[<?php echo $table_row;?>][data_type]" value="image">
																			    <input type="hidden" id="blog_post_details_data_type_value<?php echo $table_row;?>" name="blog_post_details[<?php echo $table_row;?>][data_type_value]" value="<?php echo $value->content_type_id;?>">
																			    <input type="hidden" id="blog_post_details_post_content<?php echo $table_row;?>" name="blog_post_details[<?php echo $table_row;?>][post_content]" value="<?php echo $value->content_value;?>">
																		    	<div class="row">
																			      <div class="col-md-12">
																			        <img id="data_img_src<?php echo $table_row;?>" src="<?php echo $value->content_value;?>" class="img-thumbnail" alt="Cinque Terre" style="width:200px;height:200px;border-radius:0;">
																			      </div>
																			  	</div>
																			</div>
																			    <div class="col-md-8">
																			      	<div class="input-group mb-3">
																		            	<input type="number" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_serial]" value="<?php echo $table_row;?>">
																		            	<div class="input-group-append">
																				            <span class="input-group-text" id="basic-addon2">Content Serial no.</span>
																				        </div>
																		            </div>
																		            <div class="input-group mb-3">
																		            	<input type="hidden" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_file_ext]" id="blog_post_content_file__ext<?php echo $table_row;?>" value="<?php echo $value->content_value_image_ext;?>">
																		            	<input type="text" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_file_name]" id="blog_post_content_file_name<?php echo $table_row;?>" value="<?php echo $value->content_value_image_name;?>">
																		            	<div class="input-group-append">
																				            <span class="input-group-text" id="blog_post_content_file_ext<?php echo $table_row;?>">.<?php echo $value->content_value_image_ext;?></span>
																				        </div>
																		            </div>

																			        <textarea type="text" class="form-control" id="blog_post_details_data_type_value<?php echo $table_row;?>" name="blog_post_details[<?php echo $table_row;?>][data_alt_text]" row="4" placeholder="Enter Alt text" data-gramm="false" wt-ignore-input="true"><?php echo $value->content_value_ans;?></textarea>

																			      
																		            <div class="form-group row">
																		              <div class="col-md-12">
																		                <button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media" data-media_row="<?php echo $table_row;?>" data-toggle="modal" data-target="#specificFileBrowserModal">Update Media</button>
																		                <button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trBlogPost<?php echo $table_row;?>').remove()">Delete Row</button>
																		              </div>
																		            </div>
																		        </div>
																		    </div>
																		  </div>
																		</div>
																	</td>
																</tr>
																<?php
															}else if($value->content_type=='ads'){

															}

															$table_row++;
														}
													}else{
														?>
														<tr id="trBlogPost<?php echo $table_row;?>">
															<td>
																<div class="form-group row">
																	<div class="col-md-12">
														            	<label for="blog_post_details" class="control-label">Content Detail</label>
														            	<input type="hidden" name="blog_post_details[<?php echo $table_row;?>][data_type]" value="general">
														            	<input type="hidden" class="form-control" name="blog_post_details[<?php echo $table_row;?>][data_serial]" value="0">
														            	<textarea class="form-control blog_post_details" rows="40" name="blog_post_details[<?php echo $table_row;?>][post_content]"></textarea>
														          	</div>
														        </div>
															</td>
														</tr>
														<?php
													}
													?>
												</tbody>

												<script type="text/javascript">var bposthdr='<?php echo ($table_row==0)?($table_row+1):$table_row;?>';</script>
											</table>
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




	        					<div class="col-sm-12"><h5>Schema Body</h5></div>
	        					<div class="col-sm-12">
	        						<textarea class="form-control" name="blog_schema_article_body" id="blog_schema_article_body" rows="10"><?php echo $blog_struct_data_description;?></textarea>
	        					</div>
	        					<div class="col-sm-12">
	        						<div id="editor"><?php echo $blog_struct_data_ld;?></div>
	        					</div>

	        					<?php
	        					if(!empty($blog_struct_data_ld)){
	        						?>
	        						<!-- <div class="col-sm-12">
		        						<button class="btn btn-dark" type="button" id="btn_update_blog_schema">Update Schema</button>
		        					</div> -->
	        						<?php
	        					}
	        					?>

	        					
	        				</div>
							
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4 grid-margin stretch-card">
				<div class="card">
					
					<div class="card-body">
						<h6 class="card-title">Post Categories</h6>
						
						<div class="row">
							<div class="col-lg-12">
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
							

							<h6 class="card-title">Post SEO</h6>
							<hr>
							<div class="col-lg-12">

								<div class="form-group">
									<label class="control-label" class="label_title">Focus keyphrase</label>
									<textarea class="form-control" rows="5" name="blog_post_focus_keyphrase" id="blog_post_focus_keyphrase"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_focus_keyphrase:'';?></textarea>
								</div>

								<div class="form-group">
									<label class="control-label" class="label_title">Post Meta Title</label>
									<textarea class="form-control" rows="5" name="blog_post_meta_title" id="blog_post_meta_title"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_meta_title:'';?></textarea>
								</div>
							
								<div class="form-group">
									<label class="control-label" class="label_title">Post Meta Keywords</label>
									<input class="form-control" rows="5" name="blog_post_meta_keywords" id="blog_post_meta_keywords" value="<?php echo (!empty($blog_slug_data))?$blog_slug_data->url_meta_key_words:'';?>">
								</div>
							
								<div class="form-group">
									<label class="control-label" class="label_title">Post Meta Desc</label>
									<textarea class="form-control" rows="5" name="blog_post_meta_desc" id="blog_post_meta_desc"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_meta_desc:'';?></textarea>
								</div>

								<div class="form-group">
									<label class="control-label">URL Slug</label>
									<textarea class="form-control" rows="3" name="blog_permalink_slug" id="blog_permalink_slug"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_slug:'';?></textarea>
								</div>
							
								<div class="form-group">
									<label class="control-label">Permalink</label>
									<textarea class="form-control" rows="3" name="blog_permalink" id="blog_permalink"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_permalink_value:'';?></textarea>
								</div>
							
							
								<div class="form-group">
									<label class="control-label">Canonical URL</label>
									<textarea class="form-control" rows="3" name="blog_canonical_url" id="blog_canonical_url"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_canonical_value:'';?></textarea>
								</div>
							
								<div class="form-group">
									<label class="control-label" class="label_title">Post Meta OG Title</label>
									<textarea class="form-control" rows="5" name="blog_post_meta_og_title" id="blog_post_meta_og_title"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_og_title:'';?></textarea>
								</div>
							
								<div class="form-group">
									<label class="control-label" class="label_title">Post Meta OG Desc</label>
									<textarea class="form-control" rows="5" name="blog_post_mete_og_desc" id="blog_post_mete_og_desc"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_og_desc:'';?></textarea>
								</div>
							
								<div class="form-group">
									<label class="control-label" class="label_title">Post Meta Twitter Title</label>
									<textarea class="form-control" rows="5" name="blog_post_meta_twitter_title" id="blog_post_meta_og_title"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_og_title:'';?></textarea>
								</div>
							
								<div class="form-group">
									<label class="control-label" class="label_title">Post Meta Twitter Desc</label>
									<textarea class="form-control" rows="5" name="blog_post_mete_twitter_desc" id="blog_post_mete_og_desc"><?php echo (!empty($blog_slug_data))?$blog_slug_data->url_og_desc:'';?></textarea>
								</div>
							</div>
							


							<div class="col-md-12" id="row_cover_media">
								<?php
								if(!empty($blog_post_data)){
									?>
									<div class="col-md-12">
										<input type="hidden" id="blog_post_cover_image_id" name="blog_post_cover_image_id" value="<?php echo $blog_post_data->post_cover_image_id;?>">
								    	<input type="hidden" id="blog_post_cover_image" name="blog_post_cover_image" value="<?php echo $blog_post_data->post_cover_image;?>">
								    	<div class="row">
								    		<img id="data_coberimg_src" src="<?php echo $blog_post_data->post_cover_image;?>" class="img-thumbnail" alt="Cinque Terre">
								    	</div>
								    </div>
								    <div class="col-md-12">
						    			<button type="button" id="btn_update_cover_media" class="btn btn-primary btn-icon-text mb-2 mb-md-0 btn_update_media">Update Media</button>
						    		</div>
									<?php
								}else if(empty($blog_post_data)){
									?>
									<div class="col-md-12">
								    	<div class="row">
								    		<img id="data_coberimg_src" src="<?php echo base_url('public/data/app/app_data/no.jpg');?>" class="img-thumbnail" alt="Cinque Terre">
								    	</div>
								    </div>
								    <div class="col-sm-12">
										<div class="form-group">
											<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_cover_media">Add Post Cover Image (750x500)</button>
										</div>
									</div>
									<?php
								}

								?>
							</div>

							<div class="col-md-12" id="row_cover_media">
								<?php
								if(!empty($blog_post_data)){
									?>
								  
									<div class="form-group">
										<label class="control-label">Image File Name</label>
										<div class="input-group mb-3">
											<input class="form-control" rows="3" name="blog_image_file_name" id="blog_image_file_name" value="<?php echo (!empty($blog_post_data))?$blog_post_data->post_cover_image_name:'';?>">
											<span class="input-group-text" id="blog_image_file_extension">.<?php echo (!empty($blog_post_data))?$blog_post_data->post_cover_image_extension:'';?></span>
										</div>
									</div>
								
							    
									<div class="form-group">
										<label class="control-label">Image Alt</label>
										<textarea class="form-control" rows="3" name="blog_image_alt" rows="2"><?php echo (!empty($blog_post_data))?$blog_post_data->post_cover_image_alt:'';?></textarea>
									</div>
								
									<div class="form-group">
										<label class="control-label">Image title</label>
										<textarea class="form-control" rows="3" name="blog_image_title" rows="2"><?php echo (!empty($blog_post_data))?$blog_post_data->post_cover_image_title:'';?></textarea>
									</div>
									
									<?php
								}else if(empty($blog_post_data)){
									?>
								    
									<div class="form-group">
										<label class="control-label">Image File Name</label>
										<div class="input-group mb-3">
											<input class="form-control" rows="3" name="blog_image_file_name" id="blog_image_file_name" >
											<span class="input-group-text" id="blog_image_file_extension">.</span>
										</div>
									</div>
								
							    
									<div class="form-group">
										<label class="control-label">Image Alt</label>
										<textarea class="form-control" rows="3" name="blog_image_alt" rows="2"></textarea>
									</div>
								
							    
									<div class="form-group">
										<label class="control-label">Image title</label>
										<textarea class="form-control" rows="3" name="blog_image_title" rows="2"></textarea>
									</div>
									
									<?php
								}

								?>
							</div>	

							<div class="col-md-12">
								<div class="form-group">
									<label class="control-label">Add to Search</label>
									<select class="form-control" name="blog_to_search" id="blog_to_search">
										<option value="yes">Yes</option>
										<option value="no">No</option>
									</select>
								</div>
							</div>
							<div class="col-md-12">
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
						
					</div>
				</div>
			</div>
			
		</div>
		<div class="row">
			<div class="buy-now-wrapper" id="buttons_wrapper">
				<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_add_blog_post_heading">Add Content</button>
				<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_add_blog_media">Add Media</button>
				<button type="button" class="btn btn-dark btn-icon-text mb-2 mb-md-0" id="btn_add_blog_ads">Import Ads</button>
				<button type="submit" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_save_blog">Save Data</button>
			</div>
		</div>
	</form>
</div>


<style type="text/css">
	.control-label{
		font-weight: bold;
	}
	.tagify{
		height:inherit;
	}
</style>

<script type="text/javascript">
	var colleges_links='';
	var courses_links='';
	var exams_links='';
	var blog_links='';
	var exam_page_sample_practice_paper='';
	var exam_page_answer_paper='';
	var exam_page_listening_practice_paper='';
	var exam_news='';
	var p_row='';
	var exam_page_speaking_test_paper='';
	var exam_page_writing_practice_paper='';
	var parent_folder='44138';
</script>


<script type="text/javascript">
	jQuery(function($) {
  		'use strict';

  		$("#blog_post_other_category").chosen({no_results_text: "Select Category"});
  		$('#body_tag').removeClass('sidebar-open');

  		tiny_mce('.blog_post_details');

		//jodit('.blog_post_details');

  		/***Content Details Area Add***/
  		$(document).on('click','#btn_add_blog_post_heading',function(){
		    var heading_rows='';

		    heading_rows+='<tr id="trBlogPost' + bposthdr + '">';
		    heading_rows+='<td>';
		    heading_rows+='<div class="form-group row">';
		      heading_rows+='<div class="col-md-12">';
		              heading_rows+='<h6>Content Detail</h6>';
		              heading_rows+='<input type="hidden" name="blog_post_details['+ bposthdr +'][data_type]" value="general">';
		              heading_rows+='<textarea class="form-control blog_post_details" rows="40" name="blog_post_details['+ bposthdr +'][post_content]"></textarea>';
		              heading_rows+='<input type="hidden" class="form-control" name="blog_post_details['+ bposthdr +'][data_serial]" value="'+bposthdr+'">';
		            heading_rows+='</div>';
		        heading_rows+='</div>';
		    heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trBlogPost' + bposthdr + '\').remove()">Delete Row</button></div></div>';
		    heading_rows+='</td>';
		    heading_rows+='</tr>';

		    $('#blog_heading_rows tbody').append(heading_rows);

		    tiny_mce('.blog_post_details');
			//jodit('.blog_post_details');

		    bposthdr++;
		  });


  		/***Ads****/
  		$('body').on('click','#btn_add_blog_ads',function(){
  			load_ads();
  			$('#adsModal').modal('show');
  		});


  		/****Media***/
  		$(document).on('click','#btn_add_blog_media',function(){
  			$('#specificFileBrowserModal').find('#file_spec_upload_parent_folder').val(parent_folder);
		    localStorage.setItem('media_operation', 'add_media');
		    $('#specificFileBrowserModal').modal('show');
		});

		$(document).on('click','#btn_cover_media',function(){
		    localStorage.setItem('media_operation', 'add_cover_media');
		    $('#specificFileBrowserModal').modal('show');
		});

		$(document).on('click','#btn_update_cover_media',function(){
		    localStorage.setItem('media_operation', 'update_cover_media');
		    $('#specificFileBrowserModal').modal('show');
		});

		$(document).on('click','.div_block',function(){
	      var d=$(this).html();
	      var datafile_id=$(this).attr('data-aid');
	      var heading_rows='';

	        heading_rows+='<tr id="trBlogPost' + bposthdr + '">';
	      heading_rows+='<td>';
	      heading_rows+='<div class="form-group row">';
	        heading_rows+='<div class="col-md-12">';
	                heading_rows+='<h6>Content Detail (Ads may not be visible here)</h6>';
	                heading_rows+='<input type="hidden" name="blog_post_details['+ bposthdr +'][data_type]" value="ads">';
	                heading_rows+='<input type="hidden" name="blog_post_details['+bposthdr+'][data_type_value]" value="'+datafile_id+'">';
	                heading_rows+='<input type="hidden" class="form-control" name="blog_post_details['+ bposthdr +'][data_serial]" value="'+ bposthdr +'">';
	                heading_rows+='<textarea class="form-control" rows="40" name="blog_post_details['+ bposthdr +'][post_content]" style="display:none;">'+d+'</textarea>';
	                heading_rows+='<div class="col-md-12">'+d+'</div>';
	              heading_rows+='</div>';
	          heading_rows+='</div>';
	      heading_rows+='<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trBlogPost' + bposthdr + '\').remove()">Delete Row</button></div></div>';
	      heading_rows+='</td>';
	      heading_rows+='</tr>';

	      $('#blog_heading_rows tbody').append(heading_rows);

	      //tiny_mce();

	      //$('#adsModal').modal('hide');
	      $('document.body').removeClass('modal-open');
	      $('.modal-backdrop').remove();

	    $([document.documentElement, document.body]).animate({
	        scrollTop: $("#trBlogPost"+bposthdr).offset().top
	    }, 2000);

	    $('#adsModal').modal('hide');
	    $('body').removeClass('modal-open');
		//$('.modal-backdrop').remove();
		$('.modal-backdrop').removeClass('show');

	    bposthdr++;
	  });


		/***Faqs***/
		$(document).on('click','#btn_add_blog_faqus_row',function(){

	      var faqs_rows='';

	      faqs_rows+='<tr id="trBlogfaqsDetails'+blog_faqus_row+'">';
	      faqs_rows+='<td>';
	          faqs_rows+='<div class="row">';
	            faqs_rows+='<input type="hidden" name="blog_faqus['+blog_faqus_row+'][data_type]" value="faqs"><textarea class="form-control" name="blog_faqus['+blog_faqus_row+'][ques]" aria-describedby="stream_faqus" placeholder="Question" rows="5"></textarea>';
	            faqs_rows+='</div>';
	  
	          faqs_rows+='<div class="row">';
	            faqs_rows+='<textarea class="form-control blog_post_details" name="blog_faqus['+blog_faqus_row+'][ans]" aria-describedby="stream_faqus" placeholder="Answer" rows="5"></textarea>';
	            faqs_rows+='</div>';
	            faqs_rows+='<div class="row">';
	            faqs_rows+='<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$(\'#trBlogfaqsDetails' + blog_faqus_row + '\').remove()" style="float:right;">Delete Row</button>';
	            faqs_rows+='</div>';
	          faqs_rows+='</td>';
	      faqs_rows+='</tr>';

	      $('table#form_blog_faqus_table').append(faqs_rows);

	      tiny_mce('.blog_post_details');

		  //jodit('.blog_post_details');

	      blog_faqus_row++;
	  	});


		$('#form_blog_posts_add_edit_new').validate({
			rules:{
				blog_post_name:{
					required:true,
					minlength:10,
					maxlength:255
				},
				blog_post_title:{
					required:true,
					minlength:10,
					maxlength:255
				},
				"blog_post_details[]":"required",
				blog_post_category:{
					valueNotEquals:'0'
				},
				blog_post_meta_title:{
					required:true,
					minlength:10,
					maxlength:60
				},
				blog_post_meta_desc:{
					required:true,
					minlength:10,
					maxlength:160
				},
				blog_post_meta_og_title:{
					required:true,
					minlength:10,
					maxlength:60
				},
				blog_post_mete_og_desc:{
					required:true,
					maxlength:160
				},
				blog_post_meta_twitter_title:{
					required:true,
					minlength:10,
					maxlength:60
				},
				blog_post_mete_twitter_desc:{
					required:true,
					minlength:10,
					maxlength:160
				},
				blog_image_file_name:{
					required:true,
					maxlength:255
				},
				blog_image_alt:{
					required:true,
					minlength:10,
					maxlength:255
				},
				blog_image_title:{
					required:true,
					minlength:10,
					maxlength:255
				},
				blog_post_status:{
					valueNotEquals:'0'
				}
			},
			submitHandler:function(){
		      Swal.fire({   
		          title: "Are you sure?",   
		          text: "You will be able to edit this data later",   
		          icon: 'warning',  
		          showCancelButton: true,   
		          confirmButtonColor: '#002970', 
		          cancelButtonColor: '#f11026', 
		          confirmButtonText: "Yes, create",   
		          cancelButtonText: "No, cancel",
		          allowOutsideClick: false
		      }).then((isConfirm)=>{

		        if (isConfirm) {

		          var formData=new FormData($('#form_blog_posts_add_edit_new')[0]);

		          $.ajax({
		            type:'POST',
		            url:base_url+'/blogs_add_new',
		            data:formData,
		            cache: false,
		            contentType: false,
		            processData: false,
		            timeout: 60000000,
		            target: '.preview',
		            beforeSend:function(){
		              $('#btn_save_blog').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
		            },
		            success:function(f){
		              if(f.success){
		               $('#btn_save_blog').html('Save').prop('disabled',false);
		               Swal.fire({
		                  icon: 'success',
		                  title: f.success,
		                  confirmButtonText:'Close',
		                  confirmButtonColor:'#69da68',
		                  allowOutsideClick: false,
		                });

		                window.location.href=f.redirect;           
		              }else if(f.error){
		                $('#btn_save_blog').prop('disabled',false);
		                Swal.fire({
		                  icon: 'error',
		                  title: f.error,
		                  confirmButtonText:'Close',
		                  confirmButtonColor:'#69da68',
		                  allowOutsideClick: false,
		                });
		              }else if(f.redirect){
		                $('#btn_save_blog').prop('disabled',false);
		                Swal.fire({
		                  icon: 'info',
		                  title: 'Your session expired',
		                  confirmButtonText:'Close',
		                  confirmButtonColor:'#69da68',
		                  allowOutsideClick: false,
		                });
		              }
		            }
		          });
		        }
		      });
		    }
		});

		function load_ads(){
		    $('#ads_list_table').DataTable().destroy();
		    $('#ads_list_table').DataTable({ 
		      'bJQueryUI': false,
		      'stateSave': true,
		      'iDisplayLength':50,
		      'responsive': true,
		      "pagingType": "full_numbers",
		      'language': {
		        'paginate': {
		          'first': "<<", // This is the link to the first page
		          'previous': "<", // This is the link to the previous page
		          'next': ">", // This is the link to the next page
		          'last': ">>" // This is the link to the last page
		        }
		      },
		      "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
		      "processing": true, //Feature control the processing indicator.
		      "serverSide": true, //Feature control DataTables' server-side processing mode.
		      "order": [], //Initial no order.
		      // Load data for the table's content from an Ajax source
		      "ajax": {
		          "url": base_url+'/ads/search_import',
		          "type": "POST",
		          "data":{csrf_test_name:csrf_hash}
		      },
		      //Set column definition initialisation properties.
		      "columnDefs": [
		      { 
		          "targets": [ 0 ], //first column / numbering column
		          "orderable": false, //set not orderable
		      },
		      ],
		    });
		}

  		function tinyMceEditLink(editor) {
    		editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
	    	editor.windowManager.open = function (t, r) {    // replace with our own function
	        var modal = this.oldOpen.apply(this, [t, r]);  // call original

	        if (t.title === "Insert/Edit Link") {
	            $('.tox-dialog__footer-end').append(
	                '<button title="Custom button" type="button" data-alloy-tabstop="true" tabindex="-1" class="tox-button" id="custom_button">Custom button</button>'
	            );
	        }

        	return modal; // Template plugin is dependent on this return value
    		};
  		}

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


		function tinyMceEditLinkSearch(editor){
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
		          h+='<optgroup label="Blogs">';
		          h+='<option value="blogs">Search from blogs</option>';
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
		}

		function tiny_mce(ctrl_area){
		    tinymce.init({
		      selector: ctrl_area,
		      license_key: 'gpl',
		      entity_encoding : "raw",
		      height: 400,
		      theme: 'silver',
		      browser_spellcheck: true,
		      font_family_formats:"UbuntuCondensed-Regular;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
		      font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
		      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
		      formats: {
		        alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'left' },
		        aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'center' },
		        alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'right' },
		        alignfull: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,audio,video', classes: 'full' },
		        bold: { inline: 'span', classes: 'bold' },
		        italic: { inline: 'span', classes: 'italic' },
		        underline: { inline: 'span', classes: 'underline', exact: true },
		        strikethrough: { inline: 'del' },
		        customformat: { inline: 'span', styles: { color: '#00ff00', fontSize: '20px' }, attributes: { title: 'My custom format'} , classes: 'example1'}
		      },
		      style_formats: [
		        { title: 'Custom format', format: 'customformat' },
		        { title: 'Align left', format: 'alignleft' },
		        { title: 'Align center', format: 'aligncenter' },
		        { title: 'Align right', format: 'alignright' },
		        { title: 'Align full', format: 'alignfull' },
		        { title: 'Bold text', inline: 'strong' },
		        { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
		        { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
		        { title: 'Badge', inline: 'span', styles: { display: 'inline-block', border: '1px solid #2276d2', 'border-radius': '5px', padding: '2px 5px', margin: '0 2px', color: '#2276d2' } },
		        { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' },
		        { title: 'Image formats' },
		        { title: 'Image Left', selector: 'img', styles: { 'float': 'left', 'margin': '0 10px 0 10px' } },
		        { title: 'Image Right', selector: 'img', styles: { 'float': 'right', 'margin': '0 0 10px 10px' } },
		      ],
		      toolbar: 'undo redo paste | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
		      table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
		      paste_as_text: true,
		      images_file_types: 'png,jpeg,jpg,svg,webp',
		      setup: function(editor) {
		        // Register our custom button callback function
		        editor.on('init',function(e) {
		            //tinyMceEditLink(editor);
		            tinyMceEditLinkSearch(editor);
		        });

		        editor.on('change', function () {
		          editor.save();
		        });

		      },
		      table_appearance_options: true,
		      table_use_colgroups: true
		    });
		}

		function tiny_mce_v5(ctrl_area){
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
		          // Register our custom button callback function
		          editor.on('init',function(e) {
		              //tinyMceEditLink(editor);
		              tinyMceEditLinkSearch(editor);
		          });

		        },
		        table_appearance_options: true,
		        table_use_colgroups: true
		      });
		}

	function jodit(ctrl_area){
			var editor = Jodit.make(ctrl_area, {
			zIndex: 0,
			readonly: false,
			activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
			toolbarButtonSize: 'middle',
			theme: 'default',
			saveModeInCookie: false,
			spellcheck: true,
			editorCssClass: false,
			triggerChangeEvent: true,
			width: 'auto',
			height: 'auto',
			minHeight: 100,
			direction: '',
			language: 'auto',
			debugLanguage: false,
			i18n: 'en',
			tabIndex: -1,
			toolbar: true,
			enter: "P",
			defaultMode: Jodit.MODE_WYSIWYG,
			useSplitMode: false,
			colors: {
				greyscale:  ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
				palette:    ['#980000', '#FF0000', '#FF9900', '#FFFF00', '#00F0F0', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'],
				full: [
					'#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
					'#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
					'#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
					'#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
					'#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#733554',
					'#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
				]
			},
			colorPickerDefaultTab: 'background',
			imageDefaultWidth: 300,
			removeButtons: [],
			disablePlugins: [],
			extraButtons: [],
			sizeLG: 900,
			sizeMD: 700,
			sizeSM: 400,
			sizeSM: 400,
			buttons: [
				'source', '|',
				'bold',
				'strikethrough',
				'underline',
				'italic', '|',
				'ul',
				'ol', '|',
				'outdent', 'indent',  '|',
				'font',
				'fontsize',
				'brush',
				'paragraph', '|',
				'image',
				'video',
				'table',
				'link', '|',
				'align', 'undo', 'redo', '|',
				'hr',
				'eraser',
				'copyformat', '|',
				'symbol',
				'fullsize',
				'print',
				'about'
			],
			buttonsXS: [
				'bold',
				'image', '|',
				'brush',
				'paragraph', '|',
				'align', '|',
				'undo', 'redo', '|',
				'eraser',
				'dots'
			],
			events: {},
			textIcons: false,
		});
		//editor.setEditorValue('<p>start</p>')
	}

		$('body').on('click','#custom_button',function(){
		    var search_tag=$('input#search-box').val();
		    var search_from=$('#search_form :selected').val();
		    load_search_link_list(search_tag,search_from);
		});

  $('body').on('click','.search_list_val',function(){
    var selected_url=$(this).data('link_list');

    console.log(selected_url);

    $('input[type=url]').val(selected_url);
    $("#suggesstion-box").hide();
  });


  function load_search_link_list(search_tag,search_from){
    var link_html='';

    $.ajax({
          type: "GET",
          url: base_url+'/link_list_exmas',
          data: 'search_from='+search_from+'&search_tag=' + search_tag,
          dataType: "json",
          beforeSend: function() {
              $("#search-box").css("background", "#FFF url(https://www.waytoadmissions.com/public/data/app/app_data/loader_icon.gif) no-repeat 165px");
          },
          success: function(d) {
             if(d.link_list!=''){
              var dd=JSON.parse(d.link_list);
              $.each(dd,function(i,v){
                link_html+='<li class="search_list_val" data-link_list="'+v.value+'">'+v.title+'</li>';
              });
             }
              $("#suggesstion-box").show();
              $("#search_tag-list").html(link_html);
              $("#search-box").css("background", "#FFF");
          }
      });

    
    // $.ajax({
    //   type:'POST',
    //   url:base_url+'/link_list_exmas',
    //   dataType: "json",
    //   data:{[csrf_name]:csrf_hash,search_tag:search_tag},
    //   success:function(d){
    //     if(d.link_list!=''){
    //       var dd=JSON.parse(d.link_list);
    //       //console.log(d.link_list);
    //       $.each(dd,function(i,v){

    //         console.log(v.title);
    //         link_html+='<button type="button" class="dropdown-item" data-link_list="'+v.value+'">'+v.title+'</button>';
    //       });
    //     }



    //     $('.list-autocomplete').html(link_html);
    //   }
    // });
  }


   $('#blog_post_meta_title').on('input', function(){
        var text = $(this).val();
        // Remove unwanted characters, replace spaces with hyphens, and convert to lowercase
        var slug = text
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove all non-alphanumeric characters except spaces
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase(); // Convert to lowercase
        $('#blog_permalink_slug').val(slug);
        $('#blog_permalink').val('<?php echo base_url('blog/');?>'+slug);
        $('#blog_canonical_url').val('<?php echo base_url('blog/');?>'+slug);
        
    });


   $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });
  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  });

 });
</script>