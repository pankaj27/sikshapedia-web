<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Courses's List</li>
		</ol>
	</nav>


	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Edit Meta [ <a href="<?php echo $stream_category_link;?>" target="_blank"><?php echo $stream_category->stream_category_show_name;?> - <?php echo $stream_data->stream_name;?></a> ] <a href="<?php echo $back_link;?>" class="btn btn-sm btn-primary" style="float:right;">Back</a></h6>
					<form id="form_course_streams_page_meta">
						<div class="modal-body">	            	
							<input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
							<input type="hidden" name="stream_category_type" name="stream_category_type" value="<?php echo $stream_category_id;?>">
							<input type="hidden" name="stream_id" id="stream_id" value="<?php echo $course_id;?>">
							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page Heading</strong></label>
										<input type="text" class="form-control" placeholder="Enter page heading" name="page_heading" id="page_heading" value="<?php echo (!empty($slug_url_data))?$slug_url_data->url_page_heading:'';?>">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page Sub Heading</strong></label>
										<textarea class="form-control" rows="5" placeholder="Enter page sub heading" name="page_sub_heading" id="page_sub_heading"><?php echo (!empty($slug_url_data))?$slug_url_data->url_page_sub_heading:'';?></textarea>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page Meta Title</strong></label>
										<input type="text" class="form-control" placeholder="Enter meta title" name="page_meta_title" id="page_meta_title" value="<?php echo (!empty($slug_url_data))?$slug_url_data->url_meta_title:'';?>">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page Meta Keywords</strong></label>
										<input class="form-control" placeholder="Enter meta keys" name="page_meta_keywords" id="page_meta_keywords" value="<?php echo (!empty($slug_url_data))?$slug_url_data->url_meta_key_words:'';?>">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page Meta Desc</strong></label>
										<textarea class="form-control" placeholder="Enter meta desc" name="page_meta_desc" id="page_meta_desc" rows="5"><?php echo (!empty($slug_url_data))?$slug_url_data->url_meta_desc:'';?></textarea>
									</div>
								</div>
							</div>
							
							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page OG Title</strong></label>
										<input type="text" class="form-control" placeholder="Enter og title" name="page_og_title" id="page_og_title" value="<?php echo (!empty($slug_url_data))?$slug_url_data->url_og_title:'';?>">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page OG Desc</strong></label>
										<textarea class="form-control" placeholder="Enter og description" name="page_og_desc" id="page_og_desc" rows="5"><?php echo (!empty($slug_url_data))?$slug_url_data->url_og_desc:'';?></textarea>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page Twitter Title</strong></label>
										<input type="text" class="form-control" placeholder="Enter twitter title" name="page_twitter_title" id="page_twitter_title" value="<?php echo (!empty($slug_url_data))?$slug_url_data->url_twitter_title:'';?>">
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
					        		<div class="form-group">
										<label><strong>Page Twitter Desc</strong></label>
										<textarea class="form-control" placeholder="Enter twitter description" name="page_twitter_desc" id="page_twitter_desc" rows="5"><?php echo (!empty($slug_url_data))?$slug_url_data->url_twitter_desc:'';?></textarea>
									</div>
								</div>
							</div>

							<!-- <div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label><strong>Page Search Heading</strong></label>
										<textarea class="form-control" placeholder="Enter page search heading" name="page_search_heading" id="page_search_heading" rows="5"></textarea>
									</div>
								</div>
							</div> -->

							<div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label><strong>Page Content</strong></label>
										<textarea class="form-control page_content" placeholder="Enter page search heading" name="page_content" id="page_content" rows="15"><?php echo (!empty($slug_url_data))?$slug_url_data->url_page_description:'';?></textarea>
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-md-12">
									<div class="form-group">
										<label><strong>Page Structured Data</strong></label>
										<textarea class="form-control" placeholder="Enter page Structured data" name="page_struct_data" id="page_struct_data" rows="20"><?php echo (!empty($struct_data))?$struct_data->slug_type_json_ld_data:'';?></textarea>
									</div>
								</div>
							</div>	            	
						</div>
					    <div class="modal-footer">	            	
					        <button type="submit" class="btn btn-primary" id="btn_update_course_stream_meta">Update</button>
					    </div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>