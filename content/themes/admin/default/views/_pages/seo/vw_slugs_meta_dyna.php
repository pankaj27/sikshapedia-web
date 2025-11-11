<?php
if(!empty($url_data)){
	?>
	<div class="row">

		<div class="col-lg-6" style="border: 2px solid #e0f6f6;border-radius: 10px;padding: 20px;margin-bottom: 20px;">
			<form id="form_slug_meta_data_update">
				<div class="form-group">
					<label class="control-label">Page URL</label>
					<input type="text" name="page_url" id="page_url" class="form-control" value="<?php echo (!empty($url_data))?$url_data->url_value:'';?>">
				</div>

				
	      		<div class="form-group">
					<label class="control-label">Page Canonical URL</label>
					<input type="text" name="page_canonical_url" id="page_canonical_url" class="form-control" value="<?php echo (!empty($url_data))?$url_data->url_canonical_value:'';?>">
				</div>
				
				
	      		<div class="form-group">
					<label class="control-label">Page Heading</label>
					<textarea name="page_heading" id="page_heading" class="form-control" rows="5"><?php echo (!empty($url_data))?$url_data->url_page_heading:'';?></textarea>
				</div>
				
				
	      		<div class="form-group">
					<label class="control-label">Meta Heading</label>
					<textarea name="page_meta_heading" id="page_meta_heading" class="form-control" rows="5"><?php echo (!empty($url_data))?$url_data->url_meta_heading:'';?></textarea>
				</div>
				
				
	      		<div class="form-group">
					<label class="control-label">Meta Title</label>
					<textarea name="page_meta_title" id="page_meta_title" class="form-control" rows="5"><?php echo (!empty($url_data))?$url_data->url_meta_heading:'';?></textarea>
				</div>
				
				
	      		<div class="form-group">
					<label class="control-label">Meta Description</label>
					<textarea name="page_meta_description" id="page_meta_description" class="form-control" rows="6"><?php echo (!empty($url_data))?$url_data->url_meta_desc:'';?></textarea>
				</div>

				<div class="form-group">
					<label class="control-label">Meta Keywords</label>
					<textarea name="page_meta_keywords" id="page_meta_keywords" class="form-control" rows="6"><?php echo (!empty($url_data))?$url_data->url_meta_key_words:'';?></textarea>
				</div>
				

			</form>

		</div>
		<div class="col-lg-6">
			

		</div>
	</div>
	<?php
}

?>