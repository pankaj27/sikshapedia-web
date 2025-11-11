<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="#">Dashboard</a></li>
			<li class="breadcrumb-item active" aria-current="page">Add news</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title"><a href="<?php echo $admin_base_url;?>/streams/exams/<?php echo $exam_id;?>">Exam Details</a>  >>  <?php echo $menu_data->menu_name;?></h6>
					<div class="col-md-12">
						<form id="form_exams_details_data_add_edit" method="post" enctype="multipart/form-data">
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<input type="hidden" name="_exam" id="_exam" value="<?php echo $exam_id;?>">
							<input type="hidden" name="_exam_menu" id="_exam_menu" value="<?php echo $menu_id;?>">
							<input type="hidden" name="_exam_menu_data_id" id="_exam_menu_data_id" value="">

							<div class="row">
								<div  class="row table-responsive" id="heading_rows">
									<table class="table">
										<?php $table_row='0';?>
										<tbody>
											<?php
											if(!empty($exam_details)){

												foreach ($exam_details as $key => $value) {
													if($value->exam_data_type=='general'){
														?>
														<tr id="trExamDetails<?php echo $table_row;?>">
															<td>
																<div class="form-group row">
																	<div class="col-md-12">
														            	<label for="system_meta_title"><strong>Exam Detail</strong></label>
														            	<input type="hidden" name="exam_details[<?php echo $table_row;?>][data_type]" value="general">

														            	<input type="number" class="form-control" name="exam_details[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->exam_serial;?>">

														            	<textarea class="form-control exam_details" rows="40" name="exam_details[<?php echo $table_row;?>][exam_content]"><?php echo $value->exam_content;?></textarea>
														          	</div>
														        </div>

														        <?php
														        if($table_row>0){
														        	?>
														        	<div class="form-group row"><div class="col-md-12">
															        	<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trExamDetails<?php echo $table_row;?>').remove()">Delete Row</button>
															        </div>
														        	<?php
														        }
														        ?>
															</td>
														</tr>
														<?php
													}else if($value->exam_data_type=='image'){
														?>
														<tr id="trExamDetails<?php echo $table_row;?>">
															<td>
																<div class="form-group row">
																	<div class="col-md-12">
																		<label><strong>Image Data</strong></label>
																		<input type="hidden" name="exam_details[<?php echo $table_row;?>][data_type]" value="image">
																		<input type="hidden" name="exam_details[<?php echo $table_row;?>][data_type_value]" value="<?php echo encode_data($value->exam_data_type_id);?>">
																		<input type="hidden" name="exam_details[<?php echo $table_row;?>][exam_content]" value="<?php echo $value->exam_content;?>">
																		<input type="number" class="form-control" name="exam_details[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->exam_serial;?>">
																		<div class="row">
																			<img src="<?php echo $value->exam_content;?>" class="img-thumbnail" alt="Cinque Terre">
																		</div>
																		
																		<?php
																		if($table_row>0){
																			?>
																			<div class="form-group row">
																				<div class="col-md-12">
																					<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trExamDetails<?php echo $table_row;?>').remove()">Delete Row</button>

																					
																				</div>
																			</div>
																			<?php
																		}
																		?>
																		
																	</div>
																</div>
															</td>
														</tr>
														<?php
													}else if($value->exam_data_type=='ads'){
														?>
														<tr id="trExamDetails<?php echo $table_row;?>">
													      	<td>
													      	<div class="form-group row">
													        	<div class="col-md-12">
													                <h6><strong>Exam Detail</strong></h6>
													                <input type="hidden" name="exam_details[<?php echo $table_row;?>][data_type]" value="ads">';
													                <input type="number" class="form-control" name="exam_details[<?php echo $table_row;?>][data_serial]" value="<?php echo $value->exam_serial;?>">
													                <textarea class="form-control" rows="40" name="exam_details[<?php echo $table_row;?>][exam_content]" style="display:none;"><?php echo $value->exam_content;?></textarea>
													                <div class="col-md-12"><?php echo $value->exam_content;?></div>
													             </div>
													        </div>
													      	<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trExamDetails<?php echo $table_row;?>').remove()">Delete Row</button></div></div>
													      	</td>
													    </tr>
														<?php
													}else if($value->exam_data_type=='youtube_video'){
														?>
														<tr id="trYoutube<?php echo $table_row;?>">
													      <td>
													      	<div class="form-group row">
													        	<div class="col-md-12">
													                <h6>Youtube Video</h6>
													                <input type="hidden" name="exam_details[<?php echo $table_row;?>][data_type]" value="youtube_video">';
													                <input type="text" id="ytVid<?php echo $table_row;?>" class="form-control" name="exam_details[<?php echo $table_row;?>][exam_content]" value="<?php echo $value->exam_content;?>" placeholder="Youtube URL" onpaste="set_yt_video(<?php echo $table_row;?>)" onkeyup="set_yt_video(<?php echo $table_row;?>)" onkeypress="set_yt_video(<?php echo $table_row;?>)">
													            </div>

													            <div class="col-md-12" id="trYoutubeFrameDiv<?php echo $table_row;?>">';
													                <div class="embed-responsive embed-responsive-16by9">';
													                  <iframe id="trYoutubeFrame<?php echo $table_row;?>" class="embed-responsive-item" src="<?php echo $value->exam_content;?>" allowfullscreen></iframe>
													                </div>
													            </div>
												          	</div>


													      	<div class="form-group row"><div class="col-md-12"><button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0 pull-right" onclick="$('#trNews<?php echo $table_row;?>').remove()">Delete Row</button></div></div>
													      </td>
													      </tr>
														<?php
													}

													$table_row++;
												}
											}else{
												?>
												<tr id="trExamDetails<?php echo $table_row;?>">
													<td>
														<div class="form-group row">
															<div class="col-md-12">
												            	<label for="system_meta_title"><strong>Exam Detail</strong></label>
												            	<input type="hidden" name="exam_details[<?php echo $table_row;?>][data_type]" value="general">
												            	<input type="number" class="form-control" name="exam_details[<?php echo $table_row;?>][data_serial]" value="1">
												            	<textarea class="form-control exam_details" rows="40" name="exam_details[<?php echo $table_row;?>][exam_content]"></textarea>
												          	</div>
												        </div>
													</td>
												</tr>
												<?php
											}
											?>
										</tbody>
										
									</table>
									<script type="text/javascript">var hdr='<?php echo ($table_row==0)?($table_row+1):$table_row;?>';</script>
								</div>
							</div>

							<div class="row">
								<div class="col-sm-12"><h5>Faq's</h5></div>
	        					<div class="col-sm-12">
	        						<table class="table" id="form_exam_menu_faqus_table">
			        					<thead>
			        						<tr>
			        							<th>Question/Answer</th>
			        							<th></th>
			        						</tr>
			        					</thead>
			        					<tbody>
			        					<?php
			        					$exf=0;
			        					if(!empty($exam_faq_menu_details)){
			        						foreach ($exam_faq_menu_details as $key => $value) {
			        							?>
			        							<tr>
				        							<td>
				        								<div class="row">
					        								<input type="text" class="form-control" name="exam_menu_faqus[<?php echo $exf;?>][ques]" aria-describedby="college_faqus" placeholder="Question" value="<?php echo $value->exam_content_faq;?>">
					        							</div>

					        							<div class="row">
					        								<textarea class="form-control exam_menu_info" name="exam_menu_faqus[<?php echo $exf;?>][ans]" placeholder="Answer" rows="5" style="width:100%;">
					        									<?php echo $value->exam_content;?>
					        								</textarea>
					        							</div>
					        						</td>

					        						<td>
					        							<button type="button" class="btn btn-sm btn-danger" onclick="$('#tr<?php echo $exf;?>').remove()"><i class="fa fa-minus"></i></button>
					        						</td>
					        					</tr>
			        							<?php

			        							$exf++;
			        						}
			        					}else{
			        						?>
			        						<tr>
			        							<td>
			        								<div class="row">
				        								<input type="text" class="form-control" name="exam_menu_faqus[<?php echo $exf;?>][ques]" aria-describedby="college_faqus" placeholder="Question" value="">
				        							</div>

				        							<div class="row">
				        								<textarea class="form-control exam_menu_info" name="exam_menu_faqus[<?php echo $exf;?>][ans]" placeholder="Answer" rows="5" style="width:100%;"></textarea>
				        							</div>
				        						</td>

				        						<td><button type="button" class="btn btn-xs btn-primary" id="btn_add_exam_menu_faqus_row"><i class="fa fa-plus"></i></button></td>
				        					</tr>
			        						<?php
			        					}
			        					?>      							
		        											
			        					</tbody>
			        				</table>

			        				<script type="text/javascript">var exam_menu_faq_row='<?php echo $exf;?>';</script>
	        					</div>
	        				</div>

							<div class="row">
								<div class="buy-now-wrapper" id="buttons_wrapper">
									<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" id="btn_add_heading">Add Content</button>
									<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#fileUploadModal">Upload Files</button>
									<button type="button" class="btn btn-primary btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#tinyFileBrowserModal">Add Image</button>

									<button type="button" class="btn btn-danger btn-icon-text mb-2 mb-md-0" id="btn_add_youtube_video">Add Youtube Video</button>
									
									<button type="button" class="btn btn-dark btn-icon-text mb-2 mb-md-0" data-toggle="modal" data-target="#adsModal">Import Ads</button>
									<button type="submit" class="btn btn-success btn-icon-text mb-2 mb-md-0" id="btn_save_exam_details">Save Data</button>
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

	.bodyslot-new {
	    background: #F5F8F9;
	    padding-bottom: 16px;
	    margin-top: 0;
	    margin-bottom: 10px;
	}

	.live-form-container-new .live-form-heading--icon {
	    height: 30px;
	    width: 30px;
	    margin-right: 10px;
	}
	.live-form-container-new h4 {
	    padding: 16px;
	    text-transform: uppercase;
	    color: #000;
	    font-size: 20px;
	    font-weight: 600;
	    margin-bottom: 0;
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-align-items: center;
	    -webkit-box-align: center;
	    -ms-flex-align: center;
	    align-items: center;
	    -webkit-box-pack: justify;
	    -webkit-justify-content: space-between;
	    -ms-flex-pack: justify;
	    justify-content: space-between;
	    background: #f5f8f9;
	}

	.live-form-container-new .live-form-heading--icon svg {
	    height: 30px;
	    width: 30px;
	}

	.live-form-container-new h4 .sponsored {
	    font-size: 13px;
	    background: #ef233f1f;
	    border-radius: 30px;
	    color: #EF233F;
	    padding: 5px 20px;
	}
	  
	  .live-form-container-new .live-form-body-row {
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: -ms-flexbox;
	    display: flex;
	    box-shadow: 0 0 4px 0 #cfcfcf80;
	    border-radius: 4px 4px 0px 0px;
	    overflow-x: scroll;
	}

	.live-form-container-new {
	    overflow: hidden;
	    text-align: initial;
	    background: #FFFFFF;
	    box-shadow: 0 0 4px 0 #cfcfcf80;
	    border-radius: 4px;
	}
	  
	  .ads_body_live_form_container{
	    -webkit-text-decoration: none;
	    text-decoration: none;
	    margin: 0 auto 0px;
	    max-width: 100%;
	    -webkit-flex: 1;
	    -ms-flex: 1;
	    flex: 1;
	  }

	  .live-form-container-new {
	    overflow: hidden;
	    text-align: initial;
	    background: #FFFFFF;
	    box-shadow: 0 0 4px 0 #cfcfcf80;
	    border-radius: 4px;
	  }
	  
	  .ads_live_form_desktop_tnew{
	    -webkit-text-decoration: none;
	    text-decoration: none;
	    margin: 0 auto 0px;
	    max-width: 100%;
	    -webkit-flex: 1;
	    -ms-flex: 1;
	    flex: 1;
	  }
	  
	  .ads_live_form_desktop_tnew {
	    background: #fff;
	    position: relative;
	    min-height: 100px;
	    height: 100%;
	    display: block;
	    font-size: 14px;
	    line-height: 18px;
	    color: #333;
	    font-weight: 400;
	    flex: 1;
	    padding: 16px;
	    padding-top: 12px;
	    text-align: left;
	    border-right: 1px solid #00000012;
	}

	.live-form-container-new .ads_body_live_form_container:nth-child(odd) a .ads_bottom_border {
	    background: #ff7900;
	}
	.live-form-container-new .ads_body_live_form_container:nth-child(even) a .ads_bottom_border {
	    background: #4FB8DD;
	}

	a.ads-live-form-review-banner .ads-bottom-border {
	    position: absolute;
	    bottom: 0px;
	    left: 0;
	    width: 100%;
	    height: 5px;
	    background: #ff7900 !important;
	}
	  a.ads_live_form_desktop_tnew:last-child {
	    border-right: 1px  solid #00000012;
	  }
	  .top-section {
	    display: flex;
	    align-items: center;
	    margin-bottom: 4px;
	  }
	  *, *::before, *::after {
	    box-sizing: border-box;
	  }
	  .top-section.logo {
	      border: 2px  solid #E7EBEF;
	      height: 48px;
	      width: 48px;
	      min-width: 48px;
	      border-radius: 50%;
	      overflow: hidden;
	      margin-right: 12px;
	  }
	  .top-section .college_name {
	    font-weight: 700;
	    font-size: 16px;
	    line-height: 20px;
	    color: #4FB8DD;
	    height: 42px;
	    overflow: hidden;
	  }
	  .ads_live_form_desktop_tnew .extra_info, .ads_live_form_desktop_tnew:hover .extra_info {
	    color: #333;
	  }
	  .extra_info {
	    height: 72px;
	    overflow: hidden;
	  }
	  .info-section .admission_info {
	    line-height: 17px;
	    color: #1BCE90;
	    margin-top: 4px;
	    height: 32px;
	    overflow: hidden;
	    display: flex;
	    justify-content: flex-start;
	    align-items: flex-end;
	  }
	  .apply-btn {
	    text-align: center;
	  }
	  .ads_live_form_desktop_tnew .apply, .ads_live_form_desktop_tnew .apply:hover {
	    background: #ff7900;
	    display: inline-block;
	    font-size: 14px;
	    color: #fff;
	    min-width: 220px;
	    text-align: center;
	    text-transform: uppercase;
	    border-radius: 4px;
	    padding: 6px;
	    margin-top: 8px;
	  }
	  .ads_live_form_desktop_tnew .ads_bottom_border {
	    position: absolute;
	    bottom: 0px;
	    left: 0;
	    width: 100%;
	    height: 5px;
	  }
	  a.ads-live-form-review-banner {
	    min-height: 210px;
	    min-width: 255px;
	    height: 100%;
	    color: #333;
	    padding: 16px 16px 20px 16px;
	    background: #FFF8F1;
	}
</style>

<script type="text/javascript">var hdr='<?php echo ($table_row==0)?($table_row+1):$table_row;?>';</script>

<script type="text/javascript">
	var _college='<?php echo (!empty($college_data))?$college_data['college_id']:'';?>';
	var college_name='<?php echo $college_data['college_name'];?>';
	var college_slug='<?php echo $college_slug->url_value;?>';
	var parent_folder='<?php echo $parent_folder_data->media_disk_name;?>';
	var exam_menues=<?php echo (!empty($exam_page_menues))?$exam_page_menues:'""';?>;
	var exam_news=<?php echo (!empty($exam_page_news))?:'""';?>;
	var exam_page_question_paper=<?php echo (!empty($exam_page_question_paper))?$exam_page_question_paper:'""';?>;
	var exam_page_answer_paper=<?php echo (!empty($exam_page_answer_paper))?$exam_page_answer_paper:'""';?>;

	var exam_page_speaking_test_paper=<?php echo (!empty($exam_page_speaking_test_paper))?$exam_page_speaking_test_paper:'""';?>;

	var exam_page_writing_practice_paper=<?php echo (!empty($exam_page_writing_practice_paper))?$exam_page_writing_practice_paper:'""';?>;

	var exam_page_listening_practice_paper=<?php echo (!empty($exam_page_listening_practice_paper))?$exam_page_listening_practice_paper:'""';?>;

	var exam_page_sample_practice_paper=<?php echo (!empty($exam_page_sample_practice_paper))?$exam_page_sample_practice_paper:'""';?>;

	var exam_page_syllabus_pdfs=<?php echo (!empty($exam_page_syllabus_pdfs))?$exam_page_syllabus_pdfs:'""';?>;

	var exam_page_cutoff_pdfs=<?php echo (!empty($exam_page_cutoff_pdfs))?$exam_page_cutoff_pdfs:'""';?>;
	

	var exam_id='<?php echo $exam_id;?>';
	var p_row='';
</script>