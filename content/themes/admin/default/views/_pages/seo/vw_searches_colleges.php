<?php defined('BASEPATH') OR exit('No direct script access allowed');?>

<div class="page-content">
	<nav class="page-breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item"><a href="<?php echo $admin_base_url;?>/streams">Streams</a></li>
			<li class="breadcrumb-item active" aria-current="page">Search Lists</li>
		</ol>
	</nav>

	<div class="row">
		<div class="col-md-12 grid-margin stretch-card">
			<div class="card">
				<div class="card-body">
					<h6 class="card-title">Select Search Types</h6>
					<div class="col-md-12">
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page Country</label>
									<select class="form-control" id="page_country" name="page_country">
										<option value="0">Select Country</option>
										<option value="99">India</option>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page State</label>
									<select class="form-control" id="page_state" name="page_state">
										<option value="0">Select State</option>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page City</label>
									<select class="form-control" id="page_city">
										<option value="0">Select City</option>
										
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Institute category Type</label>
									<select class="form-control" id="inst_category" name="inst_category">
										<option value="0">Select</option>
										<?php
										if(!empty($institute_categories)){
											foreach ($institute_categories as $key => $value) {
												?>
												<option value="<?php echo $value['url_slug'];?>"><?php echo $value['inst_category_short_name'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page Streams</label>
									<select class="form-control" id="page_stream" name="page_stream">
										<option value="0">Select Streams</option>
										<?php
										if(!empty($streams)){
											foreach ($streams as $key => $value) {
												?>
												<option value="<?php echo $value['stream_id'];?>"><?php echo $value['stream_name'];?></option>
												<?php
											}
										}
										?>
									</select>
								</div>
							</div>

							<div class="col-md-3">
								<div class="form-group">
									<label>Search Page Courses</label>
									<select class="form-control" id="page_course" name="page_course">
										<option value="0">Select Course</option>
										
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Ranking Agency</label>
									<select class="form-control" id="ranking_agency" name="ranking_agency">
										<option value="0">Select</option>
										<?php
										if(!empty($agencies)){
											foreach ($agencies as $key => $value) {
												?>
												<option value="<?php echo $value['url_slug'];?>"><?php echo $value['agency_short_name'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<label>Institute Type</label>
									<select class="form-control" id="inst_type" name="inst_type">
										<option value="0">Select</option>
										<?php
										if(!empty($institute_types)){
											foreach ($institute_types as $key => $value) {
												?>
												<option value="<?php echo $value['url_slug'];?>"><?php echo $value['inst_type_short_name'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-3">
								<div class="form-group">
									<label>Affiliation Type</label>
									<select class="form-control" id="affiliation_type" name="affiliation_type">
										<option value="0">Select</option>
										<?php
										if(!empty($affiliation_types)){
											foreach ($affiliation_types as $key => $value) {
												?>
												<option value="<?php echo $value['url_slug'];?>"><?php echo $value['statutory_body_abbr'];?></option>
												<?php
											}
										}

										?>
									</select>
								</div>
							</div>
							<div class="col-md-3">
								<div class="form-group">
									<button class="btn btn-sm btn-dark" type="button" style="margin-top: 33px;" id="generate_search_slug">Generate</button>
								</div>
							</div>
						</div>

						<div class="row"><hr></div>

						<div class="row">
							<div class="col-md-12" id="stat_msg"></div>
							<div class="table-responsive">
								<!-- <div>
							        Toggle column: <a class="toggle-vis" data-column="3">State</a> - <a class="toggle-vis" data-column="4">City</a> - <a class="toggle-vis" data-column="5">Estd. Year</a> - <a class="toggle-vis" data-column="7">Slug</a>
							    </div> -->
								<table id="slug_list_table" class="table">
									<thead>
				                      <tr>
				                        <th>#</th>
				                        <th>Search URL</th>				                        
				                      </tr>
				                    </thead>
				                    <tbody>		                    	
				                    </tbody>
								</table>
							</div>
						</div>
					</div>	
				</div>
			</div>
		</div>
	</div>

</div>


<div class="modal fade bd-example-modal-xl modal-fullscreen" id="editCollegeSearchMetaModal" tabindex="-1" role="dialog" aria-labelledby="editCollegeSearchMetaModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editCollegeSearchMetaModalTitle">Edit College Search Meta</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body" id="div_college_search_meta_data"></div>
        </div>
    </div>
</div>

<script type="text/javascript">
	var p_row='';
	$(document).ready(function(){

		// The DOM element you wish to replace with Tagify
	    var input = document.querySelector('input[name=page_meta_keywords]');

	    // initialize Tagify on the above input node reference
	    new Tagify(input);

		$('body').on('click','.btn_update_search_page_meta',function(){

			var page_id=$(this).data('page_id');
			var page_heading=$(this).data('page_heading');
			var page_meta_title=$(this).data('page_meta_title');
			var page_meta_keywords=$(this).data('page_meta_keywords');
			var page_meta_desc=$(this).data('page_meta_desc');
			var page_og_title=$(this).data('page_og_title');
			var page_og_desc=$(this).data('page_og_desc');

			// $('#editCollegeSearchMetaModal').find('#page_id').val(page_id);
			// $('#editCollegeSearchMetaModal').find('#page_heading').val(page_heading);
			// $('#editCollegeSearchMetaModal').find('#page_meta_title').val(page_meta_title);
			// $('#editCollegeSearchMetaModal').find('#page_meta_keywords').text(page_meta_keywords);
			// $('#editCollegeSearchMetaModal').find('#page_meta_desc').text(page_meta_desc);
			// $('#editCollegeSearchMetaModal').find('#page_og_title').val(page_og_title);
			// $('#editCollegeSearchMetaModal').find('#page_og_desc').text(page_og_desc);
			// $('#editCollegeSearchMetaModal').find('#college_meta_title').val(page_heading);


			$.ajax({
				type:'POST',
				url:base_url+'/seo/get_page_meta',
				data:{[csrf_name]:csrf_hash,page_id:page_id},
				beforeSend:function(){
					$('#div_college_search_meta_data').html('<img src="'+loader_icon+'">');
				},
				success:function(d){
					$('#div_college_search_meta_data').html(d.html);
				}
			});

			$('#editCollegeSearchMetaModal').modal('show');
		});



		



		
	});
</script>