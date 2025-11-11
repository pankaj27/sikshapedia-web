<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page"></li>
		</ol>
	</nav>

<!-- 
	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">College Search URL Meta Data </h6>
					<form class="forms-sample" id="form_college_url_data_edit" autocomplete="off" method="post">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
						<input type="hidden" name="url_id" value="<?php echo encode_data($slug_data->url_id);?>">
						<div class="form-group row">
							<div class="col-md-12">
								<label for="system_meta_title">URL</label>
								<input type="text" class="form-control" value="<?php echo $slug_data->url_value;?>" readonly>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-md-12">
								<label for="system_meta_title">URL Page Heading</label>
								<textarea class="form-control" rows="3" id="url_page_heading" name="url_page_heading"><?php echo (!empty($slug_data))?$slug_data->url_page_heading:'';?></textarea>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-md-6">
								<label for="system_meta_title">URL Meta Title</label>
								<textarea class="form-control" rows="5" id="url_meta_title" name="url_meta_title"><?php echo (!empty($slug_data))?$slug_data->url_meta_title:'';?></textarea>
							</div>
							<div class="col-md-6">
								<label for="system_meta_title">URL Meta Description</label>
								<textarea class="form-control" rows="5" id="url_mete_desc" name="url_mete_desc"><?php echo (!empty($slug_data))?$slug_data->url_meta_desc:'';?></textarea>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-md-12">
								<label for="system_meta_title">URL Meta Keywords</label>
								<textarea class="form-control" rows="5" id="url_meta_keywords" name="url_meta_keywords"><?php echo (!empty($slug_data))?$slug_data->url_meta_key_words:'';?></textarea>
							</div>							
						</div>
						<div class="form-group row">
							<div class="col-md-6">
								<label for="system_meta_title">URL OG Title</label>
								<textarea class="form-control" rows="5" id="url_og_title" name="url_og_title"><?php echo (!empty($slug_data))?$slug_data->url_og_title:'';?></textarea>
							</div>
							<div class="col-md-6">
								<label for="system_meta_title">URL OG Description</label>
								<textarea class="form-control" rows="5" id="url_og_desc" name="url_og_desc"><?php echo (!empty($slug_data))?$slug_data->url_og_desc:'';?></textarea>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-md-12">
								<button type="submit" class="btn btn-sm btn-primary" id="btn_update_meta" style="float:right;">Update Meta</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>



	</div> -->


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">College Search URL Detail Description </h6>
					<form class="forms-sample" id="form_college_url_detail_data_edit" autocomplete="off" method="post">
						<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
						<input type="hidden" name="page_id" value="<?php echo encode_data($slug_data->url_id);?>">
						<div class="form-group row">
							<div class="col-md-12">
								<label for="system_meta_title">URL</label>
								<input type="text" class="form-control" value="<?php echo $slug_data->url_value;?>" readonly>
							</div>
						</div>

						<?php $table_row=0;?>

						<div id="heading_rows" class="row table-responsive">
							<table class="table">
								<tbody>
									<?php
									if(!empty($page_data)){										
										
										foreach ($page_data as $key => $value) {

											if($value->page_data_type=='image'){
												?>
												<tr id="tr3<?php echo $table_row;?>">
													<td>
														<div class="form-group row">
														<div class="col-md-12">
															<label>Image Data</label>
															<input type="hidden" name="page_details[<?php echo $table_row;?>][data_type]" value="image">
															<input type="hidden" name="page_details[<?php echo $table_row;?>][data_type_value]" value="<?php echo encode_data($value->page_data_type_id);?>">
															<input type="hidden" name="page_details[<?php echo $table_row;?>][heading_detail]" value="<?php echo $value->page_data_value;?>">
															<div class="row"><img src="<?php echo $value->page_data_value;?>" class="img-thumbnail" alt="Cinque Terre"></div>';
														<div>
														</div>
														<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull0right" onclick="$('#tr3<?php echo $table_row;?>').remove()">Delete Row</button></div></div>
													</td>
												<tr>
												<?php
											}else if($value->page_data_type!='faqs'){
												?>
												<tr id="tr3<?php echo $table_row;?>">
													<td>
														<div class="form-group row">
															<div class="col-md-12">
																<label for="system_meta_title"><?php echo ucwords($value->page_data_type);?> Page Details</label>
																<input type="hidden" name="page_details[<?php echo $table_row;?>][data_type]" value="general">
																<textarea class="form-control page_details" rows="40" name="page_details[<?php echo $table_row;?>][heading_detail]"><?php echo $value->page_data_value;?></textarea>
															</div>
														</div>
														<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull0right" onclick="$('#tr3<?php echo $table_row;?>').remove()">Delete Row</button></div></div>
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
														<label for="system_meta_title"><strong>Page Details</strong></label>
														<input type="hidden" name="page_details[<?php echo $table_row;?>][data_type]" value="general">
														<textarea class="form-control page_details" name="page_details[<?php echo $table_row;?>][heading_detail]" rows="40"></textarea>
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

						<div class="row">
							<div class="alert alert-info">
								<h4>Question/Answer section will automatically generate FAQPage Schema if FAQS are added</h4>
							</div>
						</div>


						<div id="page_faqs_rows" class="row form-group table-responsive">
							<h6>Page FAQs</h6>
							<?php $detail_faq_row=0;?>
							<hr>
							<table class="table" id="page_faqs_rows_table">
								<thead>
									<th>Question</th>
									<th>Answer</th>
									
								</thead>
								<tbody>

									<?php
									if(!empty($page_data)){
										$faq_exits=false;
										foreach ($page_data as $key => $value) {
											if($value->page_data_type=='faqs'){
												$faq_exits=true;
												?>
												<tr id="trPageDetails<?php echo $detail_faq_row;?>">
													<td>
					        							<textarea class="form-control" name="page_faqs[<?php echo $detail_faq_row;?>][ques]" aria-describedby="page_faqs" placeholder="Question" rows="5"><?php echo $value->page_data_heading;?></textarea>
					        						</td>
					        						<td>
					        							<textarea class="form-control page_faqs" name="page_faqs[<?php echo $detail_faq_row;?>][ans]" aria-describedby="stream_faqus" placeholder="Answer" rows="5"><?php echo $value->page_data_value;?></textarea>
					        							<hr>
					        							<div class="btn-group">
						        							<button type="button" class="btn btn-xs btn-primary" id="btn_add_faqs" style="float: right;"><i class="fa fa-plus"></i></button>
						        							<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trPageDetails<?php echo $detail_faq_row;?>').remove()" style="float:right;">Delete Row</button>
						        						</div>
					        						</td>
												</tr>
												<?php

												$detail_faq_row++;
											}
												
										}

										if($faq_exits==false){
											?>
											<tr>
												<td>
				        							<textarea class="form-control" name="page_faqs[<?php echo $detail_faq_row;?>][ques]" aria-describedby="page_faqs" placeholder="Question" rows="5"></textarea>
				        						</td>
				        						<td>
				        							<textarea class="form-control page_faqs" name="page_faqs[<?php echo $detail_faq_row;?>][ans]" aria-describedby="stream_faqus" placeholder="Answer" rows="5"></textarea>
				        							<hr>
				        							<button type="button" class="btn btn-xs btn-primary" id="btn_add_faqs" style="float: right;"><i class="fa fa-plus"></i></button>
				        						</td>
											</tr>
											<?php
										}
									}else{
										?>
										<tr>
											<td>
			        							<textarea class="form-control" name="page_faqs[<?php echo $detail_faq_row;?>][ques]" aria-describedby="page_faqs" placeholder="Question" rows="5"></textarea>
			        						</td>
			        						<td>
			        							<textarea class="form-control page_faqs" name="page_faqs[<?php echo $detail_faq_row;?>][ans]" aria-describedby="stream_faqus" placeholder="Answer" rows="5"></textarea>
			        							<hr>
			        							<button type="button" class="btn btn-xs btn-primary" id="btn_add_faqs" style="float: right;"><i class="fa fa-plus"></i></button>
			        						</td>
										</tr>
										<?php
									}
									?>

									

										
								</tbody>
							</table>
							<script type="text/javascript">var detail_faq_row='<?php echo ($detail_faq_row==0)?($detail_faq_row+1):$detail_faq_row;?>';</script>								
						</div>

						<div class="buy-now-wrapper" id="buttons_wrapper">
							<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_add_heading">Add Detail</button>
							<!-- <button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_add_table_heading">Add Table</button> -->
							<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#tinyFileBrowserModal">Add Image</button>
							
							<button type="button" class="btn btn-dark btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#adsModal">Import Ads</button>
							<button type="submit" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_save_course_details_data">Save Data</button>
						</div>
					</form>
				</div>
			</div>
		</div>



	</div>

</div>


<script type="text/javascript">var p_row='';var parent_folder='<?php echo $parent_folder_data->media_disk_name;?>';</script>